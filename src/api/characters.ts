import axios from 'axios';

export interface Character {
    id: number;
    name: string;
    status: string;
    image: string;
    species: string;
}

export const fetchCharacters = async (): Promise<Character[]> => {
    try {
        const response = await axios.get('https://rickandmortyapi.com/api/character');
        return response.data.results;
    } catch (error) {
        console.error('Ошибка при загрузке персонажей:', error);
        return [];
    }
};