import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom"

import AppContext from "./AppContext"

import IssueBrowser from "./components/IssueBrowser"
import ErrorMessages from "./components/ErrorMessages"
import LoaderWidget from "./components/LoaderWidget"

class App extends React.Component {
    // For errors in the format of:
    // [{message: "first_name missing..."}, {message: "Email address in use..."}]
    setErrorMessages = (errorMessages) => { 
        this.setState({errorMessages}) }
    // Other messages not in the format above. Can set "alert-warning" or
    // "alert-success" type messages.
    setStatusMessage = (statusType, statusMessage) => {
        this.setState({statusType, statusMessage}) }

    clearAllMessages = () => {
        this.setState({errorMessages: [], statusType: null, statusMessage: null}) }


    setAuthToken = () => {}
    setLoaded = (val) => { this.setState({loaded: val}) }


    state = {
        user: {},

        loaded: false,
        errorMessages: [],
        statusType: null,
        statusMessage: null,

        setErrorMessages: this.setErrorMessages,
        clearAllMessages: this.clearAllMessages,
        setStatusMessage: this.setStatusMessage,

        setLoading: this.setLoading,
        setLoaded: this.setLoaded,
        setAuthToken: this.setAuthToken,
    }

    // componentDidMount() {
    //     this.setState({loading: false})
    // }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevState.errorMessages.length > 0) {
    //         this.setState({errorMessages: []})
    //     }

    //     if (prevState.statusType !== null) {
    //         this.setState({errorMessages: null})
    //     }

    //     if (prevState.statusMessage !== null) {
    //         this.setState({statusMessage: null})
    //     }
    // }

    render() {
        return (
            <div className="App container">
                <React.StrictMode>
                    <AppContext.Provider value={this.state}>
                        <BrowserRouter>
                            {this.state.statusMessage ? 
                                <div className={"alert alert-" + this.state.statusType}>{this.state.statusMessage}</div> : null}
                            <ErrorMessages errorMessages={this.state.errorMessages} />
                            {!this.state.loaded ? <LoaderWidget /> : null }
                            <IssueBrowser />
                        </BrowserRouter>
                    </AppContext.Provider>
                </React.StrictMode>
            </div>
        );
    }
}

export default App