import React from 'react';
import './App.css';
import { BrowserRouter } from "react-router-dom"

import AppContext from "./AppContext"

import IssueBrowser from "./components/IssueBrowser"

import LoaderWidget from "./components/LoaderWidget"

class App extends React.Component {
    setStatusMessage = (statusType, statusMessage) => { this.setState({statusType, statusMessage}) }
    setAuthToken = () => {}
    setLoading = (loading) => { this.setState({loading}) }

    state = {
        user: {},

        setAuthToken: this.setAuthToken,

        statusMessage: null,
        statusType: null,
        setStatusMessage: this.setStatusMessage,
        setLoading: this.setLoading,

        loading: true,
    }

    componentDidMount() {
        this.setState({loading: false})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.loading) {
            this.setState({loading: false})
        }
    }

    renderStatusMessage = () => {
        if (this.state.statusMessage) {
            return <div className={"alert alert-" + this.state.statusType}>{this.state.statusMessage}</div>
        }
        return null;
    }

    render() {
        return (
            <div className="App container">
                <React.StrictMode>
                    <AppContext.Provider value={this.state}>
                        <BrowserRouter>
                            {this.renderStatusMessage()}
                            {this.state.loading ? <LoaderWidget /> : <IssueBrowser />}
                        </BrowserRouter>
                    </AppContext.Provider>
                </React.StrictMode>
            </div>
        );
    }
}

export default App