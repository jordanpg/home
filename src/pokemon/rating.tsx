import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { Pokemon, PokemonClient, PokemonForm } from 'pokenode-ts';
import React, { useEffect, useMemo } from 'react';

const PokemonRatingMenu: React.FC<{
    pokemonId: string,
    smash: () => void,
    pass: () => void
}> = ({ pokemonId, smash, pass }) => {
    const [pokemon, setPokemon] = React.useState<Pokemon>();
    const [pokemonForm, setPokemonForm] = React.useState<PokemonForm>();

    React.useEffect(() => {
        if(!pokemonId) return;

        const api = new PokemonClient({ cacheOptions: { maxAge: 5000, exclude: { query: false } } });
        api.getPokemonByName(pokemonId)
            .then(setPokemon)
            .catch(console.error);
        api.getPokemonFormByName(pokemonId)
            .then(setPokemonForm)
            .catch(console.error);
    }, [pokemonId]);

    const name = useMemo(() => {
        if(!pokemonForm) return;
        console.log(pokemonForm);
        const locale = navigator.language.split('-')[0];
        const localName = pokemonForm.names.find(v => v.language.name === locale)?.name;
        return localName ?? pokemonForm.names.find(v => v.language.name === 'en')!.name;
    }, [pokemonForm]);

    const imgUrl = useMemo(() => {
        return pokemon?.sprites.other['official-artwork'].front_default
            ?? pokemon?.sprites.front_default
            ?? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    }, [pokemon]);

    if(!pokemon || !pokemonForm)
        return (
            <Stack spacing={1} justifyContent="center" alignItems="center">
                <CircularProgress />
                <Typography>
                    Loading Pokémon Data...
                </Typography>
            </Stack>
        );

    return (
        <Stack>
            <Typography variant="h4">
                {name}
            </Typography>
            <Box>
                <img src={imgUrl} />
            </Box>
        </Stack>
    );
};

export default PokemonRatingMenu;