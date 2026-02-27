<template>
  <div class="upload-container">
    <div class="upload-card">
      <h1>Quiz Application</h1>
      <p class="subtitle">Upload a compressed encoded quiz JSON file to get started</p>

      <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
        <input
          type="file"
          accept=".json"
          @change="handleFileSelect"
          ref="fileInput"
          id="file-input"
          class="file-input"
        />
        <label for="file-input" class="upload-label">
          <span class="upload-icon">&#128196;</span>
          <span>Choose compressed encoded JSON File or drag it here</span>
        </label>
        <p v-if="fileName" class="file-name">Selected: {{ fileName }}</p>
      </div>

      <button
        v-if="fileName"
        @click="uploadFile"
        class="upload-btn"
        :disabled="uploading"
      >
        {{ uploading ? 'Loading...' : 'Start Quiz' }}
      </button>

      <div v-if="errors.length" class="error-container">
        <h3>Invalid Quiz File</h3>
        <ul>
          <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizUpload',
  emits: ['quiz-loaded'],
  data() {
    return {
      fileName: '',
      fileData: null,
      uploading: false,
      errors: []
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.fileName = file.name
        this.fileData = file
        this.errors = []
      }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0]
      if (file && file.name.endsWith('.json')) {
        this.fileName = file.name
        this.fileData = file
        this.errors = []
      } else {
        this.errors = ['Please drop a .json file.']
      }
    },
    async uploadFile() {
      if (!this.fileData) return

      this.uploading = true
      this.errors = []

      try {
        const formData = new FormData()
        formData.append('quizFile', this.fileData)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (!response.ok) {
          this.errors = result.errors || ['Upload failed. Please try again.']
        } else {
          this.$emit('quiz-loaded', result.data)
        }
      } catch (err) {
        this.errors = ['Network error: could not connect to the server.']
      } finally {
        this.uploading = false
      }
    }
  }
}
</script>

<style scoped>
.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.upload-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  width: 100%;
  max-width: 520px;
}

.upload-card h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 32px;
  font-size: 1.05rem;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 40px 20px;
  margin-bottom: 20px;
  transition: border-color 0.2s;
}

.upload-area:hover {
  border-color: #4361ee;
}

.file-input {
  display: none;
}

.upload-label {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #555;
  font-size: 1rem;
}

.upload-icon {
  font-size: 2.5rem;
}

.file-name {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #4361ee;
  font-weight: 600;
}

.upload-btn {
  background: #4361ee;
  color: #fff;
  border: none;
  padding: 14px 40px;
  border-radius: 8px;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.upload-btn:hover:not(:disabled) {
  background: #3a56d4;
}

.upload-btn:disabled {
  background: #a0a0a0;
  cursor: not-allowed;
}

.error-container {
  margin-top: 24px;
  background: #fff0f0;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 16px 20px;
  text-align: left;
}

.error-container h3 {
  color: #c62828;
  margin-bottom: 8px;
  font-size: 1rem;
}

.error-container ul {
  margin: 0;
  padding-left: 20px;
}

.error-container li {
  color: #b71c1c;
  font-size: 0.9rem;
  margin-bottom: 4px;
}
</style>
