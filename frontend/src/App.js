import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";

import IssueBrowser from "./components/IssueBrowser";

function App() {
    return (
        <div className="App container">
            <BrowserRouter>
                <IssueBrowser />
            </BrowserRouter>
        </div>
    );
}

export default App;
