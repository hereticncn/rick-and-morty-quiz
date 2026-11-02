<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useCharacterStore } from './stores/characterStore';

  const characterStore = useCharacterStore();

  onMounted(() => {
    void characterStore.startGame();
  });
</script>

<template>
  <div class="quiz-app">
    <button
      type="button"
      class="music-btn"
      :aria-label="characterStore.isMusicPlaying ? 'Turn music off' : 'Turn music on'"
      :aria-pressed="characterStore.isMusicPlaying"
      @click="characterStore.toggleMusic()"
    >
      {{ characterStore.isMusicPlaying ? '🔇' : '🔊' }}
    </button>

    <main class="quiz-container">
      <div v-if="characterStore.isLoading" class="status-card" role="status">
        <h2>Opening the portal...</h2>
        <p>Loading characters</p>
      </div>

      <div v-else-if="characterStore.error" class="status-card" role="alert">
        <h2>Portal malfunction</h2>
        <p>{{ characterStore.error }}</p>
        <button type="button" @click="characterStore.startGame()">Try again</button>
      </div>

      <div v-else-if="characterStore.isGameWin" class="status-card game-win">
        <h2>You win!</h2>
        <p>Your score: {{ characterStore.score }}</p>
        <p>Best score: {{ characterStore.bestScore }}</p>
        <button type="button" @click="characterStore.restartGame()">Try again, eh-h!</button>
      </div>

      <div v-else-if="characterStore.isGameOver" class="status-card game-over">
        <h2>You lose! :(</h2>
        <p>Your score: {{ characterStore.score }}</p>
        <p v-if="characterStore.currentQuestion">
          Correct answer: {{ characterStore.currentQuestion.name }}
        </p>
        <p>Best score: {{ characterStore.bestScore }}</p>
        <button type="button" @click="characterStore.restartGame()">Try again, eh-h!</button>
      </div>

      <div v-else-if="characterStore.currentQuestion" class="question-area">
        <div class="score">Score: {{ characterStore.score }}</div>

        <transition name="fade-slide" mode="out-in">
          <div :key="characterStore.currentQuestion.id" class="question-card">
            <img :src="characterStore.currentQuestion.image" alt="Mystery character portrait" />
          </div>
        </transition>

        <p class="card-overlay">Who is this?</p>

        <div class="options-grid">
          <button
            v-for="option in characterStore.options"
            :key="option.id"
            type="button"
            @click="characterStore.checkAnswer(option.id)"
          >
            {{ option.name }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
  .quiz-app {
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    padding: 64px 16px 32px;
    text-align: center;
  }

  .music-btn {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 10;
    width: 44px;
    height: 44px;
    padding: 0;
    font-size: 1.1rem;
    background: #00ff00;
    color: #111;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(0, 255, 0, 0.45);
  }

  .quiz-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .status-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    max-width: 420px;
    padding: 32px 24px;
    border: 2px solid #00ff00;
    border-radius: 16px;
    background: rgba(0, 255, 0, 0.05);
    box-shadow: 0 0 24px rgba(0, 255, 0, 0.15);
  }

  .status-card button {
    min-width: 200px;
  }

  .game-win h2 {
    color: #00ff00;
  }

  .game-over h2 {
    color: #ff5252;
  }

  .question-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .score {
    padding: 10px 0;
    font-weight: 700;
    color: #97ce4c;
    letter-spacing: 0.5px;
  }

  .question-card {
    position: relative;
    width: min(250px, 70vw);
    height: min(250px, 70vw);
    margin: 0 auto 16px;
    overflow: hidden;
    background: #111;
    border: 4px solid #00ff00;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  }

  .question-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-overlay {
    padding: 0 0 24px;
    font-size: 1.1rem;
    color: aquamarine;
  }

  .options-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    width: 100%;
    max-width: 500px;
  }

  button {
    padding: 15px;
    font-family: inherit;
    font-size: 1rem;
    color: #00ff00;
    cursor: pointer;
    background: #1a1a1a;
    border: 2px solid #00ff00;
    border-radius: 8px;
    transition:
      background-color 0.2s,
      color 0.2s,
      box-shadow 0.2s,
      transform 0.2s;
  }

  @media (hover: hover) {
    button:hover {
      color: #111;
      background: #00ff00;
      box-shadow: 0 0 15px #00ff00;
      transform: scale(1.03);
    }

    .music-btn:hover {
      transform: scale(1.08);
    }
  }

  button:focus-visible {
    outline: 3px solid #ffffff;
    outline-offset: 3px;
  }

  button:active {
    transform: scale(0.96);
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(24px);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-24px);
  }

  @media (max-width: 420px) {
    .options-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    button,
    .fade-slide-enter-active,
    .fade-slide-leave-active {
      transition: none;
    }
  }
</style>
