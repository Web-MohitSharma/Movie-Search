import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import './MovieApp.css';

const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get(
        'https://api.themoviedb.org/3/genre/movie/list',
        {
          params: {
            api_key: '0fa2853e7c4d6c8f146aba861c5e4a06',
          },
        }
      );
      setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  const fetchMovies = async () => {
    const response = await axios.get(
      searchQuery.trim()
        ? 'https://api.themoviedb.org/3/search/movie'
        : 'https://api.themoviedb.org/3/discover/movie',
      {
        params: {
          api_key: '0fa2853e7c4d6c8f146aba861c5e4a06',
          query: searchQuery,
          sort_by: sortBy,
          with_genres: selectedGenre,
          page: pageNumber,
        },
      }
    );
    setMovies(response.data.results);
    setTotalPages(response.data.total_pages);
  };

  useEffect(() => {
    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre, pageNumber]);

  useEffect(() => {
    setPageNumber(1); // Reset to page 1 when filters change
  }, [searchQuery, sortBy, selectedGenre]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSearchSubmit = async () => {
    setPageNumber(1);
    fetchMovies();
  };

  const toggleDescription = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="#000" strokeWidth="4" fill="#f5f5f5" />
            <circle cx="32" cy="32" r="8" fill="#000" />
            <circle cx="16" cy="32" r="4" fill="#000" />
            <circle cx="48" cy="32" r="4" fill="#000" />
            <circle cx="32" cy="16" r="4" fill="#000" />
            <circle cx="32" cy="48" r="4" fill="#000" />
            <line x1="45" y1="45" x2="60" y2="60" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            <circle cx="44" cy="44" r="5" fill="#000" />
          </svg>
        </div>
        <div className="links">
          <ul>
            <li><a href="#" style={{ borderBottom: '2px solid white', paddingBottom: '4px' }}>Home</a></li>
            <li><a href="#">Movies</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <h1>MovieHouse</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={handleSearchSubmit} className="search-button">
          <AiOutlineSearch />
        </button>
      </div>
      <div className="filters">
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange}>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>
        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div className="clear">
        <button onClick={() => setSearchQuery("")}>Clear</button>
      </div>
      <div className="movie-wrapper">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <p className="rating">Rating: {movie.vote_average}</p>
            {expandedMovieId === movie.id ? (
              <p>{movie.overview}</p>
            ) : (
              <p>{movie.overview.substring(0, 150)}...</p>
            )}
            <button onClick={() => toggleDescription(movie.id)} className="read-more">
              {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="pagination">
        {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              className={page === pageNumber ? 'active' : ''}
              onClick={() => setPageNumber(page)}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MovieRecommendations;
