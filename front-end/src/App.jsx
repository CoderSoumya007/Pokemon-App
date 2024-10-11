import React, { useState, useEffect, useCallback, useRef } from 'react';
import PokemonCard from './Components/PokemonCard';
import SearchIcon from './Components/SearchIcon';

function App() {
  const [pokemons, setPokemons] = useState([]);
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
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Avoid duplicates by checking if the new Pokémon are already in the state
      setPokemons(prevPokemons => {
        const newPokemons = data.results.filter(
          newPokemon => !prevPokemons.some(pokemon => pokemon.name === newPokemon.name)
        );
        return [...prevPokemons, ...newPokemons];
      });

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

  const lastPokemonElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + LIMIT);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-center text-red-600 text-xl mt-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Pokédex</h1>
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
  );
}

export default App;
