import React from "react";
import Issues from "../modules/issues";
import { Switch, Route, NavLink, Link, Redirect, useParams } from "react-router-dom";

import "./IssueBrowser.css";
import loader_gif from "./loader.gif";

function LoaderWidget(props) {
    return (
        <img src={loader_gif} width="50" alt="loading..." />
    )
}

class UserRegistration extends React.Component {
    render() {
        return (
            <form className="rounded border p-3">
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

class NewIssueForm extends React.Component {
    render() {
        return (
            <div>

            </div>
        )
    }
}

export default class IssueBrowser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            issues: [],
            redirect: false,
            loading: true,
            noResponseFromServer: false
        }
    }

    refreshIssues() {
        Issues.getAll()
            .then(issues => { this.setState({issues, loading: false}) })
            .catch(error => {
                if (!error.response) {
                    this.setState({noResponseFromServer: true})
                }
            })
    }

    componentDidMount() {
        this.refreshIssues()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.redirect) {
            this.setState({redirect: false})
        }

        if (prevState.loading) {
            this.setState({loading: false})
        }
    }

    createIssue = (event) => {
        event.preventDefault()
        let payload = {
            title: event.target.title.value,
            body: event.target.body.value }
        Issues.create(payload)
            .then(response => { this.refreshIssues(); this.setState({redirect: true}) })
            .catch(error => { console.log(error) })
    }

    setRedirect = () => {
        this.setState({redirect: true})
    }

    setLoading = () => {
        this.setState({loading: true})
    }

    doneLoading = () => {
        this.refreshIssues()
    }

    IssueDetailWrapper(props) {
        let deleteIssue = (issue_id) => {
            props.setLoading()
            props.setRedirect();
            Issues.delete(issue_id)
                .then(response => { props.doneLoading() })
        }

        let {id} = useParams();
        let issue = props.issues.find(issue => issue.id = id)
        return (
            <div className="card">
                {props.redirect ? <Redirect to="/issues" /> : null}
                <div className="card-body">
                    <h1 className="card-title">{issue.title}</h1>
                    <p class="card-text">{issue.body}</p>
                    <button className="btn btn-primary" onClick={(e) => deleteIssue(issue.id)}>Delete</button>
                </div>
            </div>
        )
    }

    IssueList = (props) => {
        if (props.issues.length > 0) {
            return (
                <ul className="list-group">
                    {props.issues.map(issue => (
                        <li className="list-group-item" key={issue.id}><Link to={"/issues/" + issue.id}>{issue.title}</Link></li>
                    ))}
                </ul>
            )
        } else if (!props.noResponseFromServer) {
            return (
                <div className="card">
                    <div className="card-body">
                        There are no issues. Aren't you lucky?
                    </div>
                </div>
            )
        }
        return null;
    }

    render() {
        return (
            <div>
                <nav className="nav">
                    <NavLink to="/issues" className="nav-link" activeClassName="active">All</NavLink>
                    <NavLink to="/issues/create" className="nav-link" activeClassName="active">New</NavLink>
                    <NavLink to="/users/registration" className="nav-link" activeClassName="active">Register</NavLink>
                </nav>

                {this.state.noResponseFromServer ? 
                    <div className="alert alert-danger">
                        No response received from server. Is it running?
                    </div>
                : null }

                <div className="p-3">
                    {this.state.loading ?
                        <LoaderWidget />
                    :
                        <Switch>
                            <Route exact path="/users/registration">
                                <UserRegistration />
                            </Route>

                            <Route exact path="/issues">
                                <this.IssueList issues={this.state.issues} noResponseFromServer={this.state.noResponseFromServer} />
                            </Route>

                            <Route exact path="/issues/create">
                                {this.state.redirect ? <Redirect to="/issues" /> : null}
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
                            </Route>

                            <Route exact path="/issues/:id">
                                {this.state.redirect ? <Redirect to="/issues" /> : null}
                                {this.state.issues.length > 0 ? 
                                    <this.IssueDetailWrapper 
                                        issues={this.state.issues}
                                        setLoading={this.setLoading}
                                        doneLoading={this.doneLoading}
                                        setRedirect={this.setRedirect} />
                                : null }
                            </Route>
                        </Switch>
                    }
                </div>
            </div>
        )
    }
}