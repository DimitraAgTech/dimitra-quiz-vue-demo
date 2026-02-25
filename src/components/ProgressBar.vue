<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: percentage + '%' }"
      ></div>
    </div>
    <p class="progress-text">{{ current }} of {{ total }} completed</p>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    current: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  computed: {
    percentage() {
      if (this.total === 0) return 0
      return Math.round((this.current / this.total) * 100)
    }
  }
}
</script>

<style scoped>
.progress-container {
  margin-bottom: 24px;
}

.progress-bar {
  height: 10px;
  background: #e8e8e8;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4361ee, #7b8cff);
  border-radius: 5px;
  transition: width 0.4s ease;
}

.progress-text {
  text-align: center;
  margin-top: 8px;
  font-size: 0.85rem;
  color: #888;
}
</style>
