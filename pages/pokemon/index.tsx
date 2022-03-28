import { DarkMode, LightMode } from '@mui/icons-material';
import { AppBar, Box, Container, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import ColorModeToolbar from '../../src/components/ColorModeToolbar';
import { defaultRatingState, PokemonRatingState } from '../../src/pokemon/pokemonRating';
import PokemonRatingMenu from '../../src/pokemon/rating';
import PokemonStart from '../../src/pokemon/start';
import { ColorModeContext } from '../../src/theme';

const PokemonPage: React.FC = () => {
    const [state, setState] = useState<PokemonRatingState>(defaultRatingState);

    return (
        <>
            <ColorModeToolbar>
                <Typography variant="h6" noWrap>
                    Pokémon Rating
                </Typography>
            </ColorModeToolbar>
            <Container maxWidth={'lg'} sx={{
                padding: '16px'
            }}>
                { state.currIndex >= 0
                    ? <PokemonRatingMenu pokemonId={'squirtle'} smash={() => {}} pass={() => {}} />
                    : <PokemonStart state={state} setState={setState} />
                }
            </Container>
        </>
    );
};

export default PokemonPage;