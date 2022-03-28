import { Clear, Done, PlayArrow } from '@mui/icons-material';
import { Box, Button, Checkbox, Chip, Divider, Fab, FormControlLabel, FormGroup, Grid, Paper, Stack, Switch, Typography } from '@mui/material';
import { styled } from '@mui/styles';
import { Generations } from 'pokenode-ts';
import React from 'react';
import { PokemonNoVariants, PokemonWithVariants } from './pokemon';
import { PokemonRatingState } from './pokemonRating';

const ColumnContent = styled(Paper)(({theme}) => ({
    padding: '16px'
}));

const PaddedDivider = styled(Divider)(({theme}) => ({
    marginTop: '8px',
    marginBottom: '8px'
}));

const generations = [
    'Gen I',
    'Gen II',
    'Gen III',
    'Gen IV',
    'Gen V',
    'Gen VI',
    'Gen VII',
    'Gen VIII'
];

const PokemonStart: React.FC<{
    state: PokemonRatingState,
    setState: (newState: PokemonRatingState) => void
}> = ({state, setState}) => {

    const totalIncluded = React.useMemo(() => Object.values(state.includeVariants ? PokemonWithVariants : PokemonNoVariants)
        .reduce((total, curr, i) => total + (state.includedGenerations.has(i + 1) ? curr.length : 0 ), 0), [state.includeVariants, state.includedGenerations]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                <ColumnContent>
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        Pokémon Smash or Pass
                    </Typography>
                    <PaddedDivider />
                    <Typography variant="body1">
                        You will be shown every Pokémon, and must decide whether you will <b>SMASH</b> or <b>PASS</b>.
                        <br /><br />
                        A rolling count will be kept for each choice, and at the end a summary of your choices will be given.
                    </Typography>
                </ColumnContent>
            </Grid>
            <Grid item xs={12} md={12}>
                <ColumnContent>
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        Options
                    </Typography>
                    <PaddedDivider />
                    <FormGroup>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel control={
                                    <Switch checked={state.random} onChange={e => setState({ ...state, random: e.target.checked })} />
                                } label="Randomize Order" />
                                <FormControlLabel control={
                                    <Switch checked={state.includeVariants} onChange={e => setState({ ...state, includeVariants: e.target.checked })} />
                                } label="Include Variants (e.g. Mega Evolutions, Pikachu Outfits)" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <PaddedDivider sx={{ display: { md: 'none' } }} /> 
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                    Included Generations
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: '4px', mb: '8px' }}>
                                {
                                    generations.map((g, ind) => {
                                        const i: Generations = ind + 1;
                                        const inc = state.includedGenerations.has(i);
                                        const num = state.includeVariants
                                            ? PokemonWithVariants[i].length
                                            : PokemonNoVariants[i].length;

                                        return <Grid item xs={6} key={g} display="flex" alignItems='center' justifyContent='center'>
                                            <Chip 
                                                icon={inc ? <Done /> : <Clear />}
                                                onClick={e => {
                                                    if(!inc)
                                                        state.includedGenerations.add(i);
                                                    else
                                                        state.includedGenerations.delete(i);      
                                                    setState({
                                                        ...state,
                                                        includedGenerations: new Set(state.includedGenerations)
                                                    });
                                                }}
                                                label={`${g} (${num})`}
                                                variant={inc ? 'filled' : 'outlined'}
                                                color="primary"
                                                sx={{
                                                    minWidth: '150px'
                                                }}
                                            />
                                        </Grid>
                                    })
                                }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <PaddedDivider />
                                Total Pokémon Included: {totalIncluded}
                            </Grid>
                        </Grid>
                    </FormGroup>
                </ColumnContent>
            </Grid>
            <Fab
                color="primary"
                variant="extended"
                onClick={e => setState({
                    ...state,
                    currIndex: 0
                })}
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16
                }}
            >
                Begin
                <PlayArrow sx={{ ml: 1 }} />
            </Fab>
        </Grid>
    );
};

export default PokemonStart;