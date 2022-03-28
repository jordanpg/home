import { Generations } from "pokenode-ts";

export interface PokemonRatingState {
    random: boolean,
    includeVariants: boolean,
    includedGenerations: Set<Generations>,
    pokemon: string[],
    currIndex: number,
    smash: string[]
};

export const defaultRatingState: PokemonRatingState = {
    random: false,
    includeVariants: false,
    includedGenerations: new Set([1, 2, 3, 4, 5, 6, 7, 8]),
    pokemon: [],
    currIndex: -1,
    smash: []
};