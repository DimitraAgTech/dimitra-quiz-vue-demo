const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

const upload = multer({ storage: multer.memoryStorage() });

function validateQuizData(data) {
  const errors = [];

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push('Quiz data must be a JSON object.');
    return errors;
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Missing or invalid "title" field: must be a non-empty string.');
  }

  if (typeof data.date !== 'string' || !data.date.trim()) {
    errors.push('Missing or invalid "date" field: must be a non-empty string.');
  }

  if (!Array.isArray(data.questions)) {
    errors.push('Missing or invalid "questions" field: must be an array.');
    return errors;
  }

  if (data.questions.length === 0) {
    errors.push('"questions" array must contain at least one question.');
    return errors;
  }

  data.questions.forEach((q, i) => {
    const label = `Question ${i + 1}`;

    if (typeof q.id !== 'number') {
      errors.push(`${label}: missing or invalid "id" (must be a number).`);
    }

    if (typeof q.prompt !== 'string' || !q.prompt.trim()) {
      errors.push(`${label}: missing or invalid "prompt" (must be a non-empty string).`);
    }

    if (!Array.isArray(q.options)) {
      errors.push(`${label}: missing "options" (must be an array of exactly 4 strings).`);
    } else if (q.options.length !== 4) {
      errors.push(`${label}: "options" must contain exactly 4 items (found ${q.options.length}).`);
    } else {
      q.options.forEach((opt, j) => {
        if (typeof opt !== 'string' || !opt.trim()) {
          errors.push(`${label}, option ${j + 1}: must be a non-empty string.`);
        }
      });
    }

    if (typeof q.answer !== 'number' || !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) {
      errors.push(`${label}: "answer" must be an integer between 0 and 3.`);
    }
  });

  return errors;
}

app.post('/api/upload', upload.single('quizFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ errors: ['No file was uploaded.'] });
  }

  let data;
  try {
    data = JSON.parse(req.file.buffer.toString('utf-8'));
  } catch (err) {
    return res.status(400).json({ errors: ['File is not valid JSON: ' + err.message] });
  }

  const errors = validateQuizData(data);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  fs.writeFileSync(
    path.join(__dirname, 'quiz-data.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  );

  res.json({ success: true, data });
});

app.get('/api/quiz-data', (req, res) => {
  const filePath = path.join(__dirname, 'quiz-data.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } else {
    res.status(404).json({ error: 'No quiz data found. Please upload a quiz file.' });
  }
});

if (fs.existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
