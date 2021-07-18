import React, { useState, useEffect } from 'react';
import axios from './axios';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import "./Row.css";

// use rfce in js files for boilerplate component

const base_url = "https://image.tmdb.org/t/p/original"

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // Now we use useEffect to basically run the piece of code as soon as a specific element loads
    // In this case we need to run the request and retrieve the movie image as soon as the row loads
    // This accepts 2 params => 1.a callback function 2. a dependency [] so it will rerun everytime the dependency changes

    useEffect(() => {
        // to use async inside a useEffect we make an internal function and call it afterwords
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        }
    }

    const handleClick = (movie) => {
        console.log(movie);
        if (trailerUrl) {
            setTrailerUrl('')
        } else {
            movieTrailer(movie?.name || movie?.title || movie?.original_name || movie?.original_title || "")
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get('v'));
                }).catch((error) => console.log(error));
        }
    }

    return (
        <div className="row">
            <h2>{title}</h2>
            {/* in img className we did string concat so if the row is large row we add another class named row_posterLarge */}
            <div className="row_posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name} />
                ))}
            </div>
            <div style={{ padding: "40px" }}>
                {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
            </div>
        </div>
    )
}

export default Row;