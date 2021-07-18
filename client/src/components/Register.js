import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Axios from 'axios';
// import ErrorModal from '../components/error-modal.component';

export default function Register() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
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
                    localStorage.removeItem('jwt');

                    window.location = '/register';
                });
            }
        }
        checkLoggedIn();

    }, []);

    const onSubmit = async (e) => {

        try {
            e.preventDefault();

            const registerUser = {
                username,
                password,
                confirmPassword
            }

            await Axios.post("http://localhost:5000/api/users/register", registerUser);
            window.location = '/login';



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
                        <h1>Sign up</h1>
                        <form onSubmit={onSubmit} class="signup">
                            <input type="text" placeholder="Username" id="name-input" required="required" onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="Password" id="password-input" required="required" onChange={(e) => setPassword(e.target.value)} />
                            <input type="password" className="form-control" placeholder="Re-enter Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button type="submit" class="btn btn-primary btn-block btn-large">Register</button>
                            <div class="login-help">
                                <p>Already have an account? <Link to="/login" >Login</Link></p>
                            </div>
                        </form>
                    </div>
                    {error && <div>Cannot log you in</div>}
                </div>
            </div>
        </div>


    );
}
