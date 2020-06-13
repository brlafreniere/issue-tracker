import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom";

import IssueBrowser from "./components/IssueBrowser";

function App() {
    return (
        <div className="App container">
            <React.StrictMode>
                <BrowserRouter>
                    <IssueBrowser />
                </BrowserRouter>
            </React.StrictMode>
        </div>
    );
}

export default App;
