import React, { useState, useEffect } from 'react';
import '../components/component.css';

import { Button, Card } from 'react-bootstrap';
import Axios from 'axios';
export default function FavoritePage(props) {
    const [favoriteMovies, setFavoriteMovies] = useState([]);

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
        readFavoriteMovies();
    }, []);
    const readFavoriteMovies = async () => {
        await Axios({
            method: 'get',
            url: 'http://localhost:5000/api/protected/favorites',
            headers: {
                'Authorization': localStorage.getItem('jwt'),
            }
        }).then(res => {

            setFavoriteMovies(res.data);
        });
    }
    const removeFavorite = async (id) => {
        await Axios({
          method: 'delete',
          url: 'http://localhost:5000/api/protected/'+id,
          headers: {
            'Authorization': localStorage.getItem('jwt'),
          },
        }).then(res => {
          setFavoriteMovies(res.data);
        });
      }
    const Movie = (props) => ((
        <Card className="favorite-card">
            <Card.Body>

                <div className="row">
                    <div className="col-sm-3">
                        <img className="moviePoster movie-card" key={props.movie.key} src={props.movie.posterPath ? "https://image.tmdb.org/t/p/original" + props.movie.posterPath : require("../Assets/no_poster.jpg")} width="210px" height="310px" alt="movie poster" ></img>
                        <div className="row">
                            <div className="col-sm-12">
                                <p><b>{props.movie.title}</b></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-7">
                        <p>{props.movie.description}</p>
                    </div>
                    <div className="col-sm-2">
                    <Button  onClick={()=>{removeFavorite(props.movie.movieId)}} variant="outline-dark">Remove</Button>
                    </div>
                </div>
            </Card.Body>
        </Card>

    
    ));

    return (
        <div className="container-fluid movie-page">

            <div className="container-fluid favorite">
                {favoriteMovies.map(currentMovie => <Movie movie={currentMovie} key={currentMovie._id} />)}
                {favoriteMovies.length<=0&&<h4>There are no favorites...Please go back and favorite the best ones</h4>}
            </div>
        </div>
    );

}