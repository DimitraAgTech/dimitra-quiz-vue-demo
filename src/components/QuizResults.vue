<template>
  <div class="results-card">
    <h1>Quiz Complete!</h1>
    <h2 class="quiz-title">{{ quizData.title }}</h2>
    <p class="quiz-date">{{ quizData.date }}</p>

    <div class="score-display">
      <div class="score-circle">
        <span class="score-value">{{ scorePercentage }}%</span>
      </div>
      <p class="score-detail">{{ correctCount }} out of {{ questions.length }} correct</p>
    </div>

    <div class="actions">
      <button class="btn btn-secondary" @click="$emit('try-again')">
        Try Again
      </button>
      <button class="btn btn-primary" @click="downloadCertificate">
        Download Certificate
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizResults',
  props: {
    quizData: { type: Object, required: true },
    questions: { type: Array, required: true },
    userAnswers: { type: Object, required: true }
  },
  emits: ['try-again'],
  computed: {
    correctCount() {
      return this.questions.filter(
        (q) => this.userAnswers[q.id] === q.answer
      ).length
    },
    scorePercentage() {
      if (this.questions.length === 0) return 0
      return Math.round((this.correctCount / this.questions.length) * 100)
    }
  },
  methods: {
    async downloadCertificate() {
      const userName = prompt('Please enter your name:')
      if (!userName) return

      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const labels = ['A', 'B', 'C', 'D']
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20

      const safeName = this.quizData.title.replace(/[^a-zA-Z0-9]/g, '_')
      const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, '_')
      const pdfFileName = safeUserName + '_' + safeName + '_Certificate.pdf'

      // Title
      doc.setFontSize(26)
      doc.setFont(undefined, 'bold')
      doc.text('Certificate of Completion', pageWidth / 2, 35, { align: 'center' })

      // Sub-heading: user name and PDF file name
      doc.setFontSize(14)
      doc.setFont(undefined, 'normal')
      doc.text(userName + ' - ' + pdfFileName, pageWidth / 2, 46, { align: 'center' })

      // Decorative line
      doc.setDrawColor(67, 97, 238)
      doc.setLineWidth(1)
      doc.line(margin, 52, pageWidth - margin, 52)

      // Quiz title
      doc.setFontSize(18)
      doc.setFont(undefined, 'bold')
      doc.text(this.quizData.title, pageWidth / 2, 68, { align: 'center' })

      // Date
      doc.setFontSize(13)
      doc.setFont(undefined, 'normal')
      doc.text('Date: ' + this.quizData.date, pageWidth / 2, 80, { align: 'center' })

      // Score
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Score: ' + this.scorePercentage + '%', pageWidth / 2, 98, { align: 'center' })

      // Decorative line
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      doc.line(margin, 106, pageWidth - margin, 106)

      // Questions header
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      let y = 120
      doc.text('Questions & Your Answers', margin, y)
      y += 12

      // Questions and answers
      doc.setFontSize(11)
      const maxTextWidth = pageWidth - margin * 2

      this.questions.forEach((q, i) => {
        // Check if we need a new page
        if (y > 265) {
          doc.addPage()
          y = 25
        }

        // Question prompt
        doc.setFont(undefined, 'bold')
        const questionText = (i + 1) + '. ' + q.prompt
        const splitQuestion = doc.splitTextToSize(questionText, maxTextWidth)
        doc.text(splitQuestion, margin, y)
        y += splitQuestion.length * 6

        // Student's answer
        doc.setFont(undefined, 'normal')
        const userAnswerIdx = this.userAnswers[q.id]
        const answerText = '   Your Answer: ' + labels[userAnswerIdx] + '. ' + q.options[userAnswerIdx]
        const splitAnswer = doc.splitTextToSize(answerText, maxTextWidth - 5)
        doc.text(splitAnswer, margin, y)
        y += splitAnswer.length * 6 + 8
      })

      doc.save(pdfFileName)
    }
  }
}
</script>

<style scoped>
.results-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.results-card h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.quiz-title {
  font-size: 1.3rem;
  color: #4361ee;
  margin-bottom: 4px;
}

.quiz-date {
  color: #888;
  font-size: 1rem;
  margin-bottom: 32px;
}

.score-display {
  margin-bottom: 36px;
}

.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee, #7b8cff);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.score-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
}

.score-detail {
  font-size: 1.1rem;
  color: #555;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1.05rem;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
  min-width: 180px;
}

.btn-primary {
  background: #4361ee;
  color: #fff;
}

.btn-primary:hover {
  background: #3a56d4;
}

.btn-secondary {
  background: #e8e8e8;
  color: #333;
}

.btn-secondary:hover {
  background: #d5d5d5;
}
</style>
