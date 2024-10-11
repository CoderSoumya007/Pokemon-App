import React, { useState, useEffect } from 'react';

function PokemonCard({ pokemon }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        setError(error.message);
      }
    };

    fetchDetails();
  }, [pokemon.url]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 h-64 flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 h-64 flex items-center justify-center">
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-center">
        <h2 className="text-2xl font-bold text-white capitalize shadow-md  font-serif">{details.name}</h2>
      </div>
      <div className="p-4 flex flex-col items-center">
        <img
          src={details.sprites.front_default}
          alt={details.name}
          className="w-32 h-32 object-contain mb-4 transition-transform duration-300 hover:scale-110"
        />
        <div className="flex gap-2">
          {details.types.map((type) => (
            <span
              key={type.type.name}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 shadow-md"
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
