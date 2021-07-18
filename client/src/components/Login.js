import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Axios from 'axios';

// import ErrorModal from '../components/error-modal.component';

export default function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        const checkLoggedIn = async () => {
            if (localStorage.getItem('jwt')) {
                Axios({
                    method: 'get',
                    url: 'http://localhost:5000/api/users/isAuthenticated',
                    headers: {
                        'Authorization': localStorage.getItem('jwt'),
                    }
                }).then(res => {
                    window.location = '/app';

                }).catch(err => {
                    window.location = '/login';
                    localStorage.removeItem('jwt');

                });
            }
        }
        checkLoggedIn();


    }, []);
    const onSubmit = async (e) => {

        try {
            e.preventDefault();

            const loginUser = {
                username,
                password,

            }
            const loginRes = await Axios.post("http://localhost:5000/api/users/login", loginUser);

            localStorage.setItem('jwt', loginRes.data.token);
            console.log(loginRes.data.payload);

            console.log(loginRes.data.token);
            window.location = '/app';
        } catch (err) {
            setError(err.response.data.Error);
            setModalShow(true);
        }
    }

    return (

        <div className="row">

            <div className="col-sm-12 d-flex">

                <div className="card signin-card">
                    <div class="login">
                        <h1>Watch Hub</h1>
                        <form onSubmit={onSubmit} className="form-signin">
                            <input type="text" className="form-control" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            <button type="submit" class="btn btn-primary btn-block btn-large">Start Watching</button>
                            <div class="login-help">
                                <Link to="/register" >Register</Link>          </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>  


    );
}
