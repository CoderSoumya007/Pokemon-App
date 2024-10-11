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
        console.log('Fetched Pokemon details:', data); // Debugging line
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
      <div className="bg-white rounded-lg shadow-md p-4 h-64 flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-64 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
        <h2 className="text-xl font-bold text-white capitalize">{details.name}</h2>
      </div>
      <div className="p-4 flex flex-col items-center">
        <img
          src={details.sprites.front_default}
          alt={details.name}
          className="w-32 h-32 object-contain mb-4"
        />
        <div className="flex gap-2">
          {details.types.map((type) => (
            <span
              key={type.type.name}
              className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
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