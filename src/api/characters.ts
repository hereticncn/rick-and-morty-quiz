import axios, { type AxiosResponse } from 'axios';

export interface Character {
  id: number;
  name: string;
  image: string;
}

interface CharactersResponse {
  info: {
    next: string | null;
  };
  results: Character[];
}

const API_URL = 'https://rickandmortyapi.com/api/character';
const MAX_PAGES = 5;
const REQUEST_TIMEOUT_MS = 10000;

export const fetchCharacters = async (): Promise<Character[]> => {
  const characters: Character[] = [];
  let nextUrl: string | null = API_URL;
  let page = 0;

  while (nextUrl && page < MAX_PAGES) {
    const response: AxiosResponse<CharactersResponse> = await axios.get<CharactersResponse>(
      nextUrl,
      { timeout: REQUEST_TIMEOUT_MS }
    );

    characters.push(...response.data.results);
    nextUrl = response.data.info.next;
    page += 1;
  }

  return characters;
};
