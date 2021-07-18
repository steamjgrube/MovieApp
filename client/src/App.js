
import React,{useState, useEffect} from 'react';
import { BrowserRouter as Router, Route ,Switch,Redirect} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import './App.css';
import Login from "./components/Login";
import UserContext from "./context/user.context";
 import MovieApp from "./components/Home";
//  import HomePage from "./components/home-page.component";
 import Navbar from "./components/NavBar";
 import Register from "./components/Register";
import FavoritePage from './components/Favorite';

function App() {
  const [userData,setUserData]=useState({
      token:undefined,
      user:undefined,
  });
  const [loggedIn, setLoggedIn] = useState();


  useEffect(()=>{
    setLoggedIn(localStorage.getItem('jwt'));
    
  },[]);
 
  return (

    <Router>
      <UserContext.Provider value={{userData,setUserData}}>
        <div className="container-fluid">
    <Navbar isAuthenticated={loggedIn}/>

          <Switch>
          <Route path="/" exact component={Login} />

          {/* <Route path= "/login" exact component={Login} /> */}
          <Route path="/register" exact component={Register}/>

          <Route path="/app" exact component={MovieApp}/>
          <Route path="/favorites" exact component={FavoritePage}/>
          <Redirect to="/app" exact component={MovieApp}/>

          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
