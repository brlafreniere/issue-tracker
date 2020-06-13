import React from "react";
import Issues from "../modules/issues";
import { Switch, Route, NavLink, Link, Redirect, useParams } from "react-router-dom";

import "./IssueBrowser.css";
import loader_gif from "./loader.gif";

export default class IssueBrowser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            issues: [],
            redirect: false,
            loading: true,
            noResponse: false
        }
    }

    render() {
        const NewIssueForm = (props) => {
            return (
                <form onSubmit={this.createIssue}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input className="form-control" name="title" type="text" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="body">Body</label>
                        <textarea name="body" className="form-control" rows="10"></textarea>
                    </div>
                    <input type="submit" className="btn btn-primary" />
                </form>
            )
        }

        const IssueDetail = (props) => {
            let {id} = useParams()
            let issue = this.state.issues.find(issue => issue.id == id)

            if (issue) {
                return (
                    <div>
                        <h1 className="card-title">{issue.title}</h1>
                        <p className="card-text">{issue.body}</p>
                        <button className="btn btn-primary" onClick={(e) => this.deleteIssue(issue.id)}>Delete</button>
                    </div>
                )
            } else {
                return null
            }
        }

        const IssueListItem = (props) => {
            return (
                <li className="list-group-item" key={props.issue.id}>
                    ID: {props.issue.id} <br />
                    <Link to={"/issues/" + props.issue.id}>{props.issue.title}</Link>
                </li>
            )
        }

        const IssueList = (props) => {
                if (this.state.issues && this.state.issues.length > 0) {
                    return (
                        <ul className="list-group list-group-flush">
                            {this.state.issues.map(issue => <IssueListItem key={issue.id} issue={issue} />)}
                        </ul>
                    )
                } else if (!this.state.noResponse) {
                    return (
                        <div>
                            There are no issues. Aren't you lucky?
                        </div>
                    )
                }
                return null;
        }

        const MainSwitch = (props) => {
            if (this.state.loading) {
                return (
                    <div align="center">
                        <LoaderWidget />
                    </div>
                )
            } else {
                return (
                    <Switch>
                        <Route exact path="/users/registration">
                            <UserRegistration />
                        </Route>

                        <Route exact path="/issues/create/">
                            {this.state.redirect ? <Redirect to="/" /> : null}
                            <NewIssueForm />
                        </Route>

                        <Route exact path="/issues/:id">
                            {this.state.redirect ? <Redirect to="/" /> : null}
                            <IssueDetail />
                        </Route>

                        <Route exact path="/">
                            <IssueList />
                        </Route>

                    </Switch>
                )
            }
        }

        return (
            <div className="mt-5">
                <this.Navigation />
                <this.NoResponseFromServer noResponse={this.state.noResponse} />
                <div className="p-3 border border-top-0 rounded-bottom">
                    <MainSwitch />
                </div>
            </div>
        )
    }

    deleteIssue = (issue_id) => {
        this.setState({redirect: true, loading: true})
        Issues.delete(issue_id)
            .then(response => { this.refreshIssues() })
    }

    createIssue = (event) => {
        event.preventDefault()

        let payload = {
            title: event.target.title.value,
            body: event.target.body.value }

        this.setState({redirect: true, loading: true})
        console.log(this.state)
        Issues.create(payload)
            .then(response => { console.log(this.state); this.issueCreated() })
            .catch(error => { console.log(error) })
    }

    issueCreated = () => {
        console.log(this.state)
        this.refreshIssues();
    }

    setFlag = (flagKey, flagValue) => {
        this.setState({[flagKey]: flagValue})
    }

    refreshIssues = () => {
        Issues.getAll()
            .then(issues => {
                console.log(this.state)
                this.setState({issues, loading: false})
                console.log(this.state)
            })
            .catch(error => {
                if (!error.response) { this.setFlag('noResponse', true) }
            })
    }

    componentDidMount() {
        this.refreshIssues()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Have to clear redirect flag here. The redirect happens when the HTML
        // is re-rendered, because redirects happen via <Redirect /> tag. but we
        // were clearing the flag before any re-rendering happened, meaning
        // <Redirect /> was never even being rendered in the first place. So
        // after a re-render takes place, check to see if redirect = true, then
        // clear it. Doing it this way gives the <Redirect /> component a chance
        // to be rendered before being cleared.
        if (prevState.redirect) {
            this.setState({redirect: false})
        }
    }


    NoResponseFromServer = (props) => {
        if (this.state.noResponse) {
            return (
                <div className="alert alert-danger">
                    No response received from server. Is it running?
                </div>
            )
        } else {
            return null;
        }
    }

    Navigation = (props) => {
        return (
            <nav className="nav nav-tabs">
                <li className="nav-item"><NavLink to="/" exact={true} className="nav-link" activeClassName="active">All</NavLink></li>
                <li className="nav-item"><NavLink to="/issues/create/" className="nav-link" activeClassName="active">New</NavLink></li>
                <li className="nav-item"><NavLink to="/users/registration/" className="nav-link" activeClassName="active">Register</NavLink></li>
            </nav>
        )
    }
}

class UserRegistration extends React.Component {
    render() {
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="email">Email Address:</label>
                    <input name="email" type="email" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input name="password" type="password" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Confirm Password:</label>
                    <input name="password" type="password" className="form-control" />
                </div>
                <div className="form-group">
                    <input className="btn btn-primary form-control" type="submit" value="Register" />
                </div>
            </form>
        )
    }
}

function LoaderWidget(props) {
    return (
        <img src={loader_gif} width="50" alt="loading..." />
    )
}