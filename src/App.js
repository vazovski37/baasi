import React, { useState, useEffect } from "react";
import { AppWrapper } from "./components/AppWrapper";
import Cookies from "universal-cookie";
import "./App.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config.js";
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom';
import Auth from './pages/auth.js';
import Chat from './pages/chat.js';
import Photo from './pages/photo.js';
import logout from './icons/logout.png'

const cookies = new Cookies();

function App() {
  const user = cookies.get('user');
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
    console.log('as')
    console.log(showLinks)
  };

  return (
    <div className="App">
      <Router>
        {isAuth ? (
          <>
            <nav>
              <ul>

                <li>
                  <button onClick={toggleLinks}>{"<baasi />"}</button>
                </li>
                <li className={`navigation ${showLinks ? 'active' : ''}`}>
                  <div>
                    <Link to='/chat'>{ "<chat />" }</Link>
                    <Link to='/photo'>{"<photo />"}</Link>
                  </div>
                </li>
                <li>
                  <button id="logout"
                    onClick={() => {
                      cookies.remove("auth-token");
                      cookies.remove("user");
                      setIsAuth(false);
                      window.location.href = "/login";
                    }}
                  >
                    <img src={logout} />
                  </button>
                </li>
              </ul>
            </nav>
            <Route exact path="/"><Redirect to="/chat" /></Route>
            <Route path="/chat" component={Chat} />
            <Route path="/photo" component={Photo} />
          </>
        ) : (
          <>
            <Route exact path="/"><Redirect to="/login" /></Route>
            <Route path="/login" component={Auth} />
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
