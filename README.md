# Dimitra Quiz - Vue.js Multiple Choice Quiz Application

A Vue.js-based multiple choice quiz web application that allows users to upload a JSON quiz file, take a randomized quiz, and download a certificate of completion as a PDF.

## Features

- Upload a JSON file containing quiz questions and answers
- JSON file validation with descriptive error messages
- Questions displayed in randomized order
- Multiple choice format (A, B, C, D) with single correct answer
- Progress bar tracking quiz completion
- No immediate correctness feedback during the quiz
- Final score displayed as a percentage
- "Try Again" button to restart the quiz
- "Download Certificate" button generating a PDF with quiz title, date, score, and submitted answers

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (included with Node.js)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development mode

This starts both the Express backend server (port 3000) and the Vite dev server (port 5173):

```bash
npm run dev
```

Open your browser to **http://localhost:5173**.

### 3. Build for production

```bash
npm run build
```

### 4. Run in production mode

After building, start the Express server which serves the built app:

```bash
npm start
```

Open your browser to **http://localhost:3000**.

## Quiz JSON File Format

The uploaded JSON file must follow this structure:

```json
{
  "title": "Sample Quiz",
  "date": "2026-02-19",
  "questions": [
    {
      "id": 1,
      "prompt": "What is the capital of France?",
      "options": [
        "Berlin",
        "Madrid",
        "Paris",
        "Rome"
      ],
      "answer": 2
    },
    {
      "id": 2,
      "prompt": "Which planet is closest to the Sun?",
      "options": [
        "Venus",
        "Mercury",
        "Earth",
        "Mars"
      ],
      "answer": 1
    }
  ]
}
```

### Field descriptions

| Field | Type | Description |
|---|---|---|
| `title` | string | The quiz title displayed in the header and certificate |
| `date` | string | The quiz date displayed alongside the title |
| `questions` | array | Array of question objects |
| `questions[].id` | number | Unique identifier for the question |
| `questions[].prompt` | string | The question text |
| `questions[].options` | array | Exactly 4 answer options (strings) |
| `questions[].answer` | number | Index (0-3) of the correct answer in the options array |

If the uploaded file does not match this structure, the application will reject it and display specific error messages describing what is wrong.

## Project Structure

```
dimitra-quiz-vue-demo/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration with API proxy
├── server.js               # Express backend (upload, validation, static serving)
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── src/
    ├── main.js             # Vue app initialization
    ├── App.vue             # Root component with quiz state management
    └── components/
        ├── QuizUpload.vue  # File upload with drag-and-drop
        ├── QuizQuestion.vue # Single question display with A-D options
        ├── ProgressBar.vue # Visual completion progress bar
        └── QuizResults.vue # Score display, retry, and PDF certificate
```
