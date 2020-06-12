import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";

import IssueBrowser from "./components/IssueBrowser";

function App() {
    return (
        <div className="App container">
            <BrowserRouter>
                <nav className="nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/issues" className="nav-link">Issue Browser</Link>
                </nav>

                <main>
                    <Switch>
                        <Route exact path="/">
                            Home Page
                        </Route>

                        <Route path="/issues">
                            <IssueBrowser />
                        </Route>
                    </Switch>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default App;
