import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Zap, ArrowLeft } from 'lucide-react';
import { generateCommit } from '../services/api';

const CommitGenerator = () => {
  const [gitDiff, setGitDiff] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!gitDiff.trim()) {
      setError('Please provide a git diff');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await generateCommit({
        git_diff: gitDiff.trim(),
      });
      setResult(response);
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      let message = 'Failed to generate commit message. Please try again.';

      if (status === 503) {
        message = 'AI service is temporarily busy. Please wait a few minutes and try again.';
      } else if (status === 400) {
        message = detail || 'Invalid input. Please check your git diff.';
      } else if (status === 500) {
        message = 'Server configuration error. Please contact support.';
      } else if (detail) {
        message = Array.isArray(detail)
          ? detail.map((d) => d.msg || JSON.stringify(d)).join('. ')
          : detail;
      }

      setError(message);
      console.error('API error:', status, err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;

    const fullMessage = result.commit_body
      ? `${result.commit_title}\n\n${result.commit_body}`
      : result.commit_title;

    navigator.clipboard.writeText(fullMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePasteExample = () => {
    const exampleDiff = `diff --git a/src/utils/validator.ts b/src/utils/validator.ts
index 1234567..abcdefg 100644
--- a/src/utils/validator.ts
+++ b/src/utils/validator.ts
@@ -10,6 +10,8 @@ export function validateEmail(email: string): boolean {
   if (!email) {
     return false;
   }
+  // Check for valid email format
+  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
-  return email.includes('@');
+  return emailRegex.test(email);
 }`;
    setGitDiff(exampleDiff);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Zap className="h-8 w-8 text-sky-500" />
              <h1 className="text-2xl font-bold">Generate Commit Message</h1>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2 text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="git-diff" className="text-lg font-semibold text-slate-900">
                Git Diff Input
              </label>
              <button
                type="button"
                onClick={handlePasteExample}
                disabled={loading}
                className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-3 py-1 rounded text-sm font-medium transition"
              >
                Load Example
              </button>
            </div>
            
            <textarea
              id="git-diff"
              value={gitDiff}
              onChange={(e) => setGitDiff(e.target.value)}
              placeholder="Paste your git diff here or click 'Load Example'..."
              disabled={loading}
              rows={18}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed resize-none"
            />

            <button
              onClick={handleGenerate}
              disabled={loading || !gitDiff.trim()}
              className="mt-6 w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>{loading ? 'Generating...' : 'Generate Commit Message'}</span>
            </button>
          </div>

          {/* Output Section */}
          <div>
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-lg mb-6">
                <strong>Error:</strong> {error}
              </div>
            )}

            {result ? (
              <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Generated Commit Message</h2>
                  <button
                    onClick={handleCopy}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded text-sm font-medium transition flex items-center space-x-2"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                    <span>{copied ? '✓ Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Title</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <code className="text-slate-900 font-mono text-sm">{result.commit_title}</code>
                    </div>
                  </div>

                  {result.commit_body && (
                    <div>
                      <label className="block text-sm font-medium text-slate-500 mb-2">Body</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="text-slate-900 font-mono text-sm whitespace-pre-wrap">{result.commit_body}</p>
                      </div>
                    </div>
                  )}

                  
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-dashed border-slate-200 text-center shadow-sm">
                <Zap className="h-12 w-12 mx-auto text-slate-500 mb-3" />
                <p className="text-slate-500">
                  {loading ? 'Generating your commit message...' : 'Your generated commit will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommitGenerator;
