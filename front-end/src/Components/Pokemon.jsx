import React, { useState, useEffect, useCallback, useRef } from 'react';
import PokemonCard from './PokemonCard';
import SearchIcon from './SearchIcon';

export default function Pokemon(){
    const [pokemons, setPokemons] = useState(() => {
        const savedPokemons = localStorage.getItem('pokemons');
        return savedPokemons ? JSON.parse(savedPokemons) : [];
      }
      );
      const [searchTerm, setSearchTerm] = useState('');
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [offset, setOffset] = useState(0);
      const [hasMore, setHasMore] = useState(true);
      const observer = useRef();
    
      const LIMIT = 20;
    
      const fetchPokemons = useCallback(async () => {
        try {
          setLoading(true);
    
          // Check if we already have saved data in localStorage
          const savedPokemons = localStorage.getItem(`pokemons_${offset}`);
          if (savedPokemons) {
            const parsedPokemons = JSON.parse(savedPokemons);
            setPokemons(prevPokemons => [...prevPokemons, ...parsedPokemons]);
            setLoading(false);
            return;
          }
    
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${LIMIT}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
    
          const data = await response.json();
    
          const newPokemons = data.results;
    
          // Save newPokemons into localStorage for future use
          localStorage.setItem(`pokemons_${offset}`, JSON.stringify(newPokemons));
    
          // // Avoid duplicates by checking if the new Pokémon are already in the state
          // setPokemons(prevPokemons => {
          //   const newPokemons = data.results.filter(
          //     newPokemon => !prevPokemons.some(pokemon => pokemon.name === newPokemon.name)
          //   );
          //   return [...prevPokemons, ...newPokemons];
          // });
    
          setPokemons(prevPokemons => [...prevPokemons, ...newPokemons]);
    
          console.log(data);
          console.log(pokemons);
    
          setHasMore(data.next !== null);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching Pokémon:', error);
          setError(error.message);
          setLoading(false);
        }
      }, [offset]);
    
      useEffect(() => {
        fetchPokemons();
      }, [fetchPokemons]);
    
      const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    
      const lastPokemonElementRef = useCallback(node => {
        // If currently loading or search results are less than 20, do not trigger infinite scroll
        if (loading || (searchTerm && filteredPokemons.length <= LIMIT)) return;
    
        if (observer.current) observer.current.disconnect();
    
        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
            setOffset(prevOffset => prevOffset + LIMIT);
          }
        });
    
        if (node) observer.current.observe(node);
      }, [loading, hasMore, searchTerm, filteredPokemons.length]);
    
    
      if (error) {
        return <div className="text-center text-red-600 text-xl mt-10">Error: {error}</div>;
      }
    
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-8"
          style={{ backgroundImage: 'url(https://images.squarespace-cdn.com/content/v1/613ef8a0a3de987d28d14431/1662051124297-VAO30XSO47Z7HPVSYSEV/Pokemon_SV_Worldmap.jpg)' }}>
          <h1 className="text-7xl font-bold text-center mb-8 text-purple  -800">Pokédex</h1>
    
          <div className="max-w-md mx-auto mb-8 relative">
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
    
          <div className="overflow-y-auto h-[65vh] px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPokemons.map((pokemon, index) => (
                <div
                  key={pokemon.name}
                  ref={index === filteredPokemons.length - 1 ? lastPokemonElementRef : null}
                >
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))}
            </div>
            {loading && <p className="text-center text-xl text-blue-800 mt-4">Loading more Pokémon...</p>}
            {!hasMore && <p className="text-center text-xl text-blue-800 mt-4">No more Pokémon to load</p>}
          </div>
        </div>
      );
}