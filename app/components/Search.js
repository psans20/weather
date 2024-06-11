import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdGpsFixed } from 'react-icons/md';

export default function Search({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      onSearch(query);
    }
  };

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        onSearch({ lat: latitude, lon: longitude });
      }, (error) => {
        console.error('Error fetching location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form className="flex" onSubmit={handleSearch}>
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <div className="absolute top-0 right-0 flex">
            <button
              type="submit"
              className="p-2.5 text-sm font-medium h-full text-white bg-cyan-700 border border-cyan-700 hover:bg-green-600 focus:outline-none"
            >
              <FaSearch className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Search</span>
            </button>
            <button
              type="button"
              className="p-2.5 text-sm font-medium h-full text-white bg-cyan-700 border border-cyan-700 hover:bg-green-600 focus:outline-none"
              onClick={handleLocationSearch}
            >
              <MdGpsFixed className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Find my location</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
