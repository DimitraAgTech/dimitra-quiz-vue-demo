<template>
  <div class="question-card">
    <h3 class="question-number">Question {{ questionNumber }} of {{ totalQuestions }}</h3>
    <p class="prompt">{{ question.prompt }}</p>

    <div class="options">
      <label
        v-for="(option, index) in question.options"
        :key="index"
        class="option"
        :class="{ selected: selectedOption === index }"
      >
        <input
          type="radio"
          :name="'q-' + question.id"
          :value="index"
          v-model="selectedOption"
        />
        <span class="option-letter">{{ labels[index] }}.</span>
        <span class="option-text">{{ option }}</span>
      </label>
    </div>

    <button
      @click="submit"
      :disabled="selectedOption === null"
      class="submit-btn"
    >
      {{ questionNumber === totalQuestions ? 'Finish Quiz' : 'Submit Answer' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'QuizQuestion',
  props: {
    question: { type: Object, required: true },
    questionNumber: { type: Number, required: true },
    totalQuestions: { type: Number, required: true }
  },
  emits: ['submit-answer'],
  data() {
    return {
      selectedOption: null,
      labels: ['A', 'B', 'C', 'D']
    }
  },
  watch: {
    question() {
      this.selectedOption = null
    }
  },
  methods: {
    submit() {
      if (this.selectedOption === null) return
      this.$emit('submit-answer', this.selectedOption)
    }
  }
}
</script>

<style scoped>
.question-card {
  margin-top: 24px;
}

.question-number {
  font-size: 0.95rem;
  color: #888;
  font-weight: 500;
  margin-bottom: 12px;
}

.prompt {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 24px;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.option {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.option:hover {
  border-color: #4361ee;
  background: #f8f9ff;
}

.option.selected {
  border-color: #4361ee;
  background: #eef0ff;
}

.option input[type='radio'] {
  display: none;
}

.option-letter {
  font-weight: 700;
  color: #4361ee;
  margin-right: 12px;
  font-size: 1rem;
  min-width: 20px;
}

.option-text {
  font-size: 1rem;
  color: #333;
}

.submit-btn {
  background: #4361ee;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1.05rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #3a56d4;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
