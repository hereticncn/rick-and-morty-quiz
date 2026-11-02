import { defineStore } from 'pinia';
import { fetchCharacters, type Character } from '../api/characters.ts';

const OPTIONS_COUNT = 4;
const POINTS_PER_CORRECT_ANSWER = 10;
const BEST_SCORE_KEY = 'rick-and-morty-quiz:best-score';

let audio: HTMLAudioElement | null = null;

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const readBestScore = (): number => {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
};

const writeBestScore = (score: number): void => {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    return;
  }
};

export const useCharacterStore = defineStore('characterStore', {
  state: () => ({
    characters: [] as Character[],
    usedCharacterIds: [] as number[],
    currentQuestion: null as Character | null,
    options: [] as Character[],
    score: 0,
    bestScore: readBestScore(),
    isGameOver: false,
    isGameWin: false,
    isLoading: false,
    error: null as string | null,
    isMusicPlaying: false,
  }),

  actions: {
    initAudio() {
      if (!audio) {
        const audioPath = `${import.meta.env.BASE_URL}audio/Ryan_Elder_-_Rick_and_Morty_Main_Title_Theme_Song.mp3`;

        audio = new Audio(audioPath);
        audio.loop = true;
        audio.volume = 0.3;
      }

      return audio;
    },

    async toggleMusic() {
      const player = this.initAudio();

      if (this.isMusicPlaying) {
        player.pause();
        this.isMusicPlaying = false;
        return;
      }

      try {
        await player.play();
        this.isMusicPlaying = true;
      } catch (error) {
        console.error('Could not start music playback:', error);
        this.isMusicPlaying = false;
      }
    },

    async loadCharacters() {
      this.isLoading = true;
      this.error = null;

      try {
        this.characters = await fetchCharacters();

        if (this.characters.length < OPTIONS_COUNT) {
          this.characters = [];
          this.error = 'Not enough characters to start the quiz. Please try again later.';
        }
      } catch (error) {
        console.error('Could not load characters:', error);
        this.characters = [];
        this.error = 'Could not load characters. Check your connection and try again.';
      } finally {
        this.isLoading = false;
      }
    },

    async startGame() {
      if (this.characters.length === 0) {
        await this.loadCharacters();
      }

      if (this.characters.length === 0) {
        return;
      }

      this.score = 0;
      this.usedCharacterIds = [];
      this.currentQuestion = null;
      this.options = [];
      this.isGameOver = false;
      this.isGameWin = false;
      this.getNextQuestion();
    },

    async restartGame() {
      await this.startGame();
    },

    getNextQuestion() {
      const availableCharacters = this.characters.filter(
        (character) => !this.usedCharacterIds.includes(character.id)
      );

      if (availableCharacters.length === 0) {
        this.currentQuestion = null;
        this.options = [];
        this.isGameWin = true;
        return;
      }

      const question = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
      const distractors = shuffle(
        this.characters.filter((character) => character.id !== question.id)
      ).slice(0, OPTIONS_COUNT - 1);

      this.currentQuestion = question;
      this.options = shuffle([question, ...distractors]);
    },

    checkAnswer(id: number) {
      if (this.isGameOver || this.isGameWin) {
        return;
      }

      if (id !== this.currentQuestion?.id) {
        this.isGameOver = true;
        this.saveBestScore();
        return;
      }

      this.usedCharacterIds.push(id);
      this.score += POINTS_PER_CORRECT_ANSWER;
      this.saveBestScore();
      this.getNextQuestion();
    },

    saveBestScore() {
      if (this.score <= this.bestScore) {
        return;
      }

      this.bestScore = this.score;
      writeBestScore(this.score);
    },
  },
});
