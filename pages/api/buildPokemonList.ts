import type { NextApiRequest, NextApiResponse } from 'next'
import { Generation, Generations, MainClient } from 'pokenode-ts';
import QueryString from 'query-string';

// i made this API because i wanted to pregenerate lists of pokemon using pokeapi
// since there are no convenient APIs that allow fast access to the data that i need
// not intended to be used in live deployments

type PokemonListResponse = {
    [generation in Generations]?: string[]
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PokemonListResponse>
) {
    // include provides a comma-separated list of generation numbers
    // e.g. 1,2,3 to include gen I, II, and III.
    // if variants is given in the query, then it will include variants such as mega evolutions
    const { query: { include, variants } } = QueryString.parseUrl(req.url!);

    let list: PokemonListResponse = {};

    if(typeof include === 'string')
    {
        const api = new MainClient({
            cacheOptions: { maxAge: 5000, exclude: { query: false } }
        });

        const included = include.split(',');
        for(const i of included)
        {
            const g: Generations = parseInt(i);
            if(g === NaN || !(g in Generations))
                continue;

            let generation: Generation;
            generation = await api.game.getGenerationById(g);

            // the generation API doesn't return a meaningfully ordered species list
            // this was reported and dismissed @ https://github.com/PokeAPI/pokeapi/issues/404
            // curse you cmmartti and a pox on your mailman (Just Kidding I Love You Thank You So Much)
            // (But I Think The General Expectation Is That Results Are Sorted By Ascending Pokedex Number)
            // so we have to sort it ourselves -__________________________________-
            // to avoid more unnecessary API requests we just grab IDs from the provided URL
            // since the API doesnt return numeric IDs
            const genSpecies: [number, string][] = generation.pokemon_species.map(v => [
                parseInt(/pokemon-species\/(\d+)\//.exec(v.url)![1]),
                v.name
            ]);
            genSpecies.sort((a, b) => a[0] - b[0]);
            list[g] = genSpecies.map(v => v[1]);
            
            if(variants !== undefined)
            {
                // fetch all variety names in parallel and insert them into the list
                await Promise.all(list[g]!.map(name => {
                    return new Promise(async (resolve, reject) => {
                        const species = await api.pokemon.getPokemonSpeciesByName(name);
                        // get the index of the base variety after the await since things will shift around
                        let ind = list[g]!.findIndex(v => v === name);
                        for(const { pokemon } of species.varieties)
                        {
                            if(pokemon.name === name) continue;
                            list[g]!.splice(++ind, 0, pokemon.name);
                        }
                        resolve(true);
                    });
                }));
            }
        }
    }

    res.status(200).json(list);
}