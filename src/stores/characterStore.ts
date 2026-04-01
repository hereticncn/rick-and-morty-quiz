import { defineStore } from 'pinia';
import {fetchCharacters} from "../api/characters.ts";
import type { Character } from "../api/characters.ts"

export const useCharacterStore = defineStore('characterStore', {
    state: () => ({
        characters: [] as Character[],
        usedCharacterIds: [] as number[],
        currentQuestion: null as Character | null,
        options: [] as Character[],
        score: 0,
        isGameOver: false,
        isGameWin: false,
        isLoading: false,
        isMusicPlaying: false,
        audio: null as HTMLAudioElement | null,
    }),

    actions: {
        initAudio() {
            if (!this.audio) {
                const audioPath = `${import.meta.env.BASE_URL}audio/Ryan_Elder_-_Rick_and_Morty_Main_Title_Theme_Song.mp3`;

                this.audio = new Audio(audioPath);
                this.audio.loop = true;
                this.audio.volume = 0.3;
            }
        },

        toggleMusic() {
            this.initAudio();
            if (this.isMusicPlaying) {
                this.audio?.pause();
            } else {
                this.audio?.play();
            }
            this.isMusicPlaying = !this.isMusicPlaying;
        },

        async loadCharacters() {
            this.isLoading = true;
            try {
                const data = await fetchCharacters();
                this.characters = data;
            } finally {
                this.isLoading = false;
            }
        },
        getNextQuestion() {
            const availableCharacters = this.characters.filter(
                char => !this.usedCharacterIds.includes(char.id)
            );

            if (availableCharacters.length === 0) {
                alert("Ого! Ты знаешь всех! Портал закрыт.");
                this.isGameWin = true;
                return;
            }

            const randomIndex = Math.floor(Math.random() * availableCharacters.length);
            this.currentQuestion = availableCharacters[randomIndex];

            const answers = [this.currentQuestion];
            while (answers.length < 4) {
                const randomFake = this.characters[Math.floor(Math.random() * this.characters.length)];
                if (!answers.find(a => a.id === randomFake.id)) {
                    answers.push(randomFake);
                }
            }
            this.options = answers.sort(() => Math.random() - 0.5);
        },

        checkAnswer(id: number) {
            if (id === this.currentQuestion?.id) {
                this.usedCharacterIds.push(id);

                this.score += 10;
                this.getNextQuestion();
            } else {
                this.isGameOver = true;
            }
        },
        restartGame() {
            this.score = 0;
            this.usedCharacterIds = [];
            this.isGameOver = false;
            this.getNextQuestion();
        },

        resetGame() {
            this.score = 0;
            this.usedCharacterIds = [];
            this.isGameWin = false;
            this.getNextQuestion();
        }
    },

    getters: {
        aliveCharacters: (state) => {
            return state.characters.filter(char => char.status === 'Alive');
        }
    }
});