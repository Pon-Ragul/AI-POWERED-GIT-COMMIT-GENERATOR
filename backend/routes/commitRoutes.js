const express = require('express');
const router = express.Router();
const { generateCommit, getCommits } = require('../controllers/commitController');

router.post('/generate-commit', generateCommit);
router.get('/commits', getCommits);

module.exports = router;
