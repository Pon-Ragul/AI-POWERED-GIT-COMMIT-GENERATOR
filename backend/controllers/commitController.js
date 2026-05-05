const axios = require('axios');
const Commit = require('../models/Commit');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const generatePrompt = (gitDiff, style) => {
  const styleDescription = style === 'short'
    ? 'Write a concise commit message title only.'
    : style === 'detailed'
      ? 'Write a detailed commit title and commit body in a developer-friendly format.'
      : 'Write a conventional commit message title and a short body, if needed.';

  return `You are an AI assistant that generates high-quality git commit messages from a git diff.\n\nInput diff:\n${gitDiff}\n\nInstructions:\n- Analyze the diff and summarize the main change.\n- Write all commit messages in PAST TENSE (e.g., "added feature", "fixed bug", "refactored code").\n- Use the requested style: ${styleDescription}\n- If the diff is simple, generate a single clear commit title.\n- If the diff is complex, include a commit body explaining the change clearly.\n- IMPORTANT: Respond ONLY with valid JSON containing exactly these keys: commit_title, commit_body, confidence (number 0-1).\n- Do not include any text before or after the JSON.\n\nJSON Response:`;
};

const parseGeminiResponse = (responseText) => {
  const extractJson = (text) => {
    if (typeof text !== 'string') return null;

    const trimmed = text.trim();
    try {
      return JSON.parse(trimmed);
    } catch (_err) {
      const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (fencedMatch) {
        try {
          return JSON.parse(fencedMatch[1].trim());
        } catch (_err2) {
          // fall through to generic extraction
        }
      }

      const jsonMatch = trimmed.match(/({[\s\S]*})/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (_err3) {
          return null;
        }
      }
    }

    return null;
  };

  console.log('Attempting to parse Gemini response:', responseText.substring(0, 500));
  const parsed = extractJson(responseText);
  if (!parsed) {
    console.error('Failed to parse Gemini response. Raw text:', responseText);
    return null;
  }

  return {
    commitTitle: parsed.commit_title || parsed.title || '',
    commitBody: parsed.commit_body || parsed.body || '',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
  };
};

const callGemini = async (prompt) => {
  if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not set in environment variables');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;
  const requestBody = {
    model: `models/${GEMINI_MODEL}`,
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 512,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          commit_title: { type: 'string', description: 'The commit title' },
          commit_body: { type: 'string', description: 'The commit body or details' },
          confidence: { type: 'number', description: 'Confidence score 0-1' },
        },
        required: ['commit_title', 'commit_body', 'confidence'],
      },
    },
  };

  try {
    console.log('Calling Gemini API with URL:', url);
    console.log('Gemini request body keys:', Object.keys(requestBody));

    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const candidate = response?.data?.candidates?.[0];
    const resultText = candidate?.content?.parts?.map((part) => part.text || '').join('')
      || JSON.stringify(response.data || '');

    console.log('Gemini API response received, length:', resultText.length);
    return resultText;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message || error);
    throw error;
  }
};

exports.generateCommit = async (req, res) => {
  const { git_diff: gitDiff = '', style = 'conventional' } = req.body || {};

  if (typeof gitDiff !== 'string' || !gitDiff.trim()) {
    return res.status(400).json({
      error: 'Missing required field `git_diff`.',
      detail: 'Please provide a non-empty git diff in the request body.',
    });
  }

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({
      error: 'Gemini API key missing.',
      detail: 'Set GOOGLE_API_KEY in backend/.env before starting the server.',
    });
  }

  try {
    const prompt = generatePrompt(gitDiff.trim(), style);
    const rawOutput = await callGemini(prompt);
    const parsed = parseGeminiResponse(rawOutput);

    if (!parsed) {
      console.error('Gemini parsing failed. Raw response:', rawOutput);
      return res.status(502).json({
        error: 'Invalid response from Gemini API.',
        detail: 'The Gemini response could not be parsed into the expected JSON shape.',
        debug: rawOutput.substring(0, 1000), // Include first 1000 chars for debugging
      });
    }

    const commit = new Commit({
      gitDiff: gitDiff.trim(),
      style,
      commitTitle: parsed.commitTitle,
      commitBody: parsed.commitBody,
      confidence: parsed.confidence,
    });

    await commit.save();

    return res.json({
      commit_title: parsed.commitTitle,
      commit_body: parsed.commitBody,
      confidence: parsed.confidence,
    });
  } catch (error) {
    console.error('Commit generation error:', error.response?.data || error.message || error);

    // Handle specific Gemini API errors
    if (error.response?.status === 503 || error.response?.data?.error?.code === 503) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable.',
        detail: 'The Gemini AI model is currently experiencing high demand. Please try again in a few minutes.',
      });
    }

    return res.status(502).json({
      error: 'Failed to generate commit message.',
      detail: error.response?.data || error.message,
    });
  }
};

exports.getCommits = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const commits = await Commit.find().sort({ createdAt: -1 }).limit(limit);

    return res.json(commits.map((commit) => ({
      id: commit._id,
      git_diff: commit.gitDiff,
      style: commit.style,
      commit_title: commit.commitTitle,
      commit_body: commit.commitBody,
      confidence: commit.confidence,
      created_at: commit.createdAt,
    })));
  } catch (error) {
    console.error('Get commits error:', error.message || error);
    return res.status(500).json({ error: 'Failed to retrieve commits.' });
  }
};
