<template>
  <div class="app">
    <QuizUpload v-if="phase === 'upload'" @quiz-loaded="startQuiz" />

    <div v-else-if="phase === 'quiz'" class="quiz-container">
      <header class="quiz-header">
        <h1>{{ quizData.title }}</h1>
        <p class="quiz-date">{{ quizData.date }}</p>
      </header>
      <ProgressBar :current="answeredCount" :total="shuffledQuestions.length" />
      <QuizQuestion
        :question="currentQuestion"
        :questionNumber="currentQuestionIndex + 1"
        :totalQuestions="shuffledQuestions.length"
        @submit-answer="handleAnswer"
      />
    </div>

    <QuizResults
      v-else-if="phase === 'results'"
      :quizData="quizData"
      :questions="shuffledQuestions"
      :userAnswers="userAnswers"
      @try-again="restartQuiz"
    />
  </div>
</template>

<script>
import QuizUpload from './components/QuizUpload.vue'
import QuizQuestion from './components/QuizQuestion.vue'
import ProgressBar from './components/ProgressBar.vue'
import QuizResults from './components/QuizResults.vue'

export default {
  name: 'App',
  components: { QuizUpload, QuizQuestion, ProgressBar, QuizResults },
  data() {
    return {
      phase: 'upload',
      quizData: null,
      shuffledQuestions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      answeredCount: 0
    }
  },
  computed: {
    currentQuestion() {
      return this.shuffledQuestions[this.currentQuestionIndex]
    }
  },
  methods: {
    startQuiz(data) {
      this.quizData = data
      this.shuffledQuestions = this.shuffleArray([...data.questions])
      this.currentQuestionIndex = 0
      this.userAnswers = {}
      this.answeredCount = 0
      this.phase = 'quiz'
    },
    handleAnswer(answerIndex) {
      this.userAnswers[this.currentQuestion.id] = answerIndex
      this.answeredCount++

      if (this.currentQuestionIndex < this.shuffledQuestions.length - 1) {
        this.currentQuestionIndex++
      } else {
        this.phase = 'results'
      }
    },
    restartQuiz() {
      this.startQuiz(this.quizData)
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
  color: #333;
  min-height: 100vh;
}

.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 20px;
}

.quiz-container {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.quiz-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;
}

.quiz-header h1 {
  font-size: 1.8rem;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.quiz-date {
  font-size: 1rem;
  color: #666;
}
</style>
