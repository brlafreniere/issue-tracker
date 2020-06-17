import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom"

import IssueBrowser from "./components/IssueBrowser"
import ErrorMessages from "./components/ErrorMessages"
import LoaderWidget from "./components/LoaderWidget"

const AppContext = React.createContext({})

export {AppContext}

const StatusMessage = (props) => {
    const appContext = useContext(AppContext)

    useEffect(() => {
        appContext.setMessagesRendered(true)
    }, [])

    return (
        <div className={"alert alert-" + props.message.type}>
            {props.message.text}
        </div>
    )
}

function App(props) {
    const [statusMessage, setStatusMessage] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [user, setUser] = useState(null)
    const [errors, setErrors] = useState(null)
    const [messagesRendered, setMessagesRendered] = useState(null)

    const contextValue = {
        statusMessage, setStatusMessage,
        loaded, setLoaded,
        user, setUser,
        errors, setErrors,
        messagesRendered, setMessagesRendered,
    }

    return (
        <div className="App container">
            <React.StrictMode>
                <AppContext.Provider value={contextValue}>
                    { errors ? <ErrorMessages errors={errors} /> : null }
                    { statusMessage ? <StatusMessage message={statusMessage} /> : null }
                    <BrowserRouter>
                        { ! loaded ? <LoaderWidget /> : null }
                        <IssueBrowser />
                    </BrowserRouter>
                </AppContext.Provider>
            </React.StrictMode>
        </div>
    );
}

export default App