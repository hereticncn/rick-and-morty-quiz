<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useCharacterStore } from './stores/characterStore';

  const characterStore = useCharacterStore();

  onMounted(async () => {
    await characterStore.loadCharacters();
    characterStore.getNextQuestion();
  });
</script>

<template>
  <div class="controls">
    <button @click="characterStore.toggleMusic" class="music-btn">
      {{ characterStore.isMusicPlaying ? '🔇' : '🔊' }}
    </button>
  </div>

  <div class="quiz-container">

    <div v-if="characterStore.isGameWin" class="game-win">
      <h2>You win!</h2>
      <p>Your score: {{ characterStore.score }}</p>
      <button @click="characterStore.resetGame()">Try again, eh-h!</button>
    </div>

    <div v-if="characterStore.isGameOver" class="game-over">
      <h2>You lose! :( </h2>
      <p>Your score: {{ characterStore.score }}</p>
      <button @click="characterStore.restartGame()">Try again, eh-h!</button>
    </div>

    <div v-else-if="characterStore.currentQuestion && !characterStore.isGameWin">

      <div class="score">Score: {{ characterStore.score }}</div>

      <transition name="fade-slide" mode="out-in">
        <div :key="characterStore.currentQuestion.id" class="question-card">
          <img :src="characterStore.currentQuestion.image" alt="Who is this?" />
        </div>
      </transition>

      <div class="card-overlay">Who is this?</div>

      <div class="options-grid">
        <button
            v-for="option in characterStore.options"
            :key="option.id"
            @click="characterStore.checkAnswer(option.id)"
        >
          {{ option.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
  #app {
    padding: 10px;
  }

  .music-btn {
    padding: 10px;
    background: #00ff00;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }

  .score {
    padding: 10px 0;
  }

  .card-overlay {
    padding: 10px 0 35px;
    color: aquamarine;
  }

  .game-win, .game-over {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .question-card {
    position: relative;
    width: 250px;
    height: 250px;
    margin: 0 auto 20px;
    border: 4px solid #00ff00;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  }

  .question-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    max-width: 500px;
    margin: 0 auto;
  }

  button {
    padding: 15px;
    font-size: 1rem;
    cursor: pointer;
    background: #1a1a1a;
    color: #00ff00;
    border: 2px solid #00ff00;
    border-radius: 8px;
    transition: all 0.2s;
  }

  @media (hover: hover) {
    button:hover {
      background: #00ff00;
      color: #1a1a1a;
      box-shadow: 0 0 15px #00ff00;
      transform: scale(1.05);
    }
  }

  button:active {
    transform: scale(0.95);
    background: #00ff00;
    color: #1a1a1a;
  }

  .card img {
    width: 100%;
    height: auto;
  }

  @media (min-width: 768px) {
    .music-btn {
      top: 20px;
      bottom: auto;
      right: 20px;
      padding: 10px;
      border-radius: 5px;
    }
  }
</style>