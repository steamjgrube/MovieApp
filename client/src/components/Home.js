import React, { useState, useEffect } from 'react';
import '../App.css';
import Axios from 'axios';
import MovieModal from './MovieDetails';
import '../components/component.css';


import { Button, Col, Row } from 'react-bootstrap';


export default function MovieApp() {
    const [movies, setMovies] = useState([]);
    const [movieTitle, setMovieTitle] = useState("");
    const [selectedMovie, setSelectedMovie] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    /*
    "POPULAR"-popular movies
    "SEARCH"-searched movies by user
    "IN_THEATRES"-movies currently in theatre
    */
    const [movieApiSource, setMovieApiSource] = useState("POPULAR");
    useEffect(() => {

        const checkLoggedIn = async () => {
            if (localStorage.getItem('jwt')) {

                Axios({
                    method: 'get',
                    url: 'http://localhost:5000/api/users/isAuthenticated',
                    headers: {
                        'Authorization': localStorage.getItem('jwt'),
                    }
                }).catch(err => {
                    window.location = '/';
                    localStorage.removeItem('jwt');
                });
            }

        }
        checkLoggedIn();


        switch (movieApiSource) {
            case 'POPULAR':
                readPopularMovies(pageNumber);

                break;
            case 'SEARCH':
                searchMovie(pageNumber);
                break;
        }
    }, [pageNumber]);

    const readPopularMovies = async (pageNumber) => {
        setMovieApiSource("POPULAR");
        setPageNumber(pageNumber);
        await Axios({
            method: 'post',
            url: 'http://localhost:5000/api/protected/get_popular_movies',
            headers: {
                'Authorization': localStorage.getItem('jwt'),
            },
            data: {
                pageNumber
            }
        }).then(res => {

            setMovies(res.data);
        });
    }
    const readNowPlayingMovies = async (pageNumber) => {
        setMovieApiSource("IN_THEATRES");
        setPageNumber(pageNumber);
        await Axios({
            method: 'post',
            url: 'http://localhost:5000/api/protected/get_now_playing',
            headers: {
                'Authorization': localStorage.getItem('jwt'),
            },
            data: {
                pageNumber
            }

        }).then(res => {

            setMovies(res.data);
        });
    }

    const readUpcomingMovies = async (pageNumber) => {
        setMovieApiSource("UPCOMING");
        setPageNumber(pageNumber);
        await Axios({
            method: 'post',
            url: 'http://localhost:5000/api/protected/get_upcoming',
            headers: {
                'Authorization': localStorage.getItem('jwt'),
            },
            data: {
                pageNumber
            }

        }).then(res => {

            setMovies(res.data);
        });
    }


    const onSubmit = async (e) => {
        setMovieApiSource("SEARCH");

        setPageNumber(1);

        try {
            e.preventDefault();
            e.target.reset();

            searchMovie(1);

        } catch (err) {

        }
    }
    const searchMovie = async (pageNumber) => {

        await Axios({
            method: 'post',
            url: 'http://localhost:5000/api/protected/get_search',
            headers: {
                'Authorization': localStorage.getItem('jwt'),
            },
            data: {
                movieTitle,
                pageNumber
            }
        }).then(res => {
            setMovies(res.data);
            // setMovieTitle("");
        });

    }
    const imageClick = async (movie) => {
        setSelectedMovie(movie);
        setModalShow(true);
    }

    const Movies = (props) => ((

        <>
            <button type="button" className="movie-poster-button" onClick={() => imageClick(props.movie)}><img className="moviePoster movie-card" key={props.movie.key} src={props.movie.poster_path ? "https://image.tmdb.org/t/p/original" + props.movie.poster_path : require("../Assets/no_poster.jpg")} width="200px" height="300px"  alt="movie poster"></img></button>
        </>
    ));

    const nextPage = async () => {
        setPageNumber(pageNumber + 1);
    }
    const previousPage = async () => {

        setPageNumber(pageNumber - 1);

    }
    return (

        <div className="container-fluid movie-page">
            <MovieModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                movie={selectedMovie}

            />

            <form onSubmit={onSubmit} className="form-add-task">
                <Row>
                    <Col xs={8}>
                        <div className="form-group">
                            <input type="text" className="movie-search form-control" placeholder="Enter a movie title..." onChange={(e) => setMovieTitle(e.target.value)} />
                        </div>

                    </Col>
                    <Col xs={4}>
                        <Button className="text-uppercase search-btn" variant="dark" type="submit" disabled={movieTitle <= 0}>Search</Button>


                    </Col>
                </Row>
                <div className="row">
                    <div className="col-sm-12 d-flex">

                        <h1>Popular Movies</h1>
                    </div>
                </div>

                <div className="container card-container">

                    {movies.map(currentMovie => <Movies movie={currentMovie} key={currentMovie.id} />)}
                    {movies.length <= 0 && <h4>No movies are found</h4>}

                </div>
            </form>

        </div>

    );
}
