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
            noResponseFromServer: false
        }
    }

    render() {
        return (
            <div className="mt-5">
                <this.Navigation />
                <this.NoResponseFromServer noResponseFromServer={this.state.noResponseFromServer} />
                <div className="p-3 border border-top-0 rounded-bottom">
                    <this.MainSwitch />
                </div>
            </div>
        )
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

    IssueDetail = (props) => {
        let deleteIssue = (issue_id) => {
            this.setLoading()
            this.setRedirect();
            Issues.delete(issue_id)
                .then(response => { this.doneLoading() })
        }

        let {id} = useParams();
        let issue = this.state.issues.find(issue => issue.id == id)

        if (issue) {
            return (
                <div>
                    <h1 className="card-title">{issue.title}</h1>
                    <p className="card-text">{issue.body}</p>
                    <button className="btn btn-primary" onClick={(e) => deleteIssue(issue.id)}>Delete</button>
                </div>
            )
        } else {
            return null;
        }
    }

    NoResponseFromServer = (props) => {
        if (this.state.noResponseFromServer) {
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
                <li className="nav-item"><NavLink to="/issues/" exact={true} className="nav-link" activeClassName="active">All</NavLink></li>
                <li className="nav-item"><NavLink to="/issues/create/" className="nav-link" activeClassName="active">New</NavLink></li>
                <li className="nav-item"><NavLink to="/users/registration/" className="nav-link" activeClassName="active">Register</NavLink></li>
            </nav>
        )
    }

    MainSwitch = (props) => {
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
                        {this.state.redirect ? <Redirect to="/issues" /> : null}
                        <NewIssueForm createIssueCallBack={this.createIssue} />
                    </Route>

                    <Route exact path="/issues/:id">
                        {this.state.redirect ? <Redirect to="/issues" /> : null}
                        <this.IssueDetail />
                    </Route>

                    <Route exact path="/issues/">
                        <this.IssueList />
                    </Route>

                </Switch>
            )
        }
    }

    IssueListItem = (props) => {
        return (
            <li className="list-group-item" key={props.issue.id}>
                ID: {props.issue.id} <br />
                <Link to={"/issues/" + props.issue.id}>{props.issue.title}</Link>
            </li>
        )
    }

    IssueList = (props) => {
        if (this.state.issues.length > 0) {
            return (
                <ul className="list-group list-group-flush">
                    {this.state.issues.map(issue => <this.IssueListItem key={issue.id} issue={issue} />)}
                </ul>
            )
        } else if (!this.state.noResponseFromServer) {
            return (
                <div>
                    There are no issues. Aren't you lucky?
                </div>
            )
        }
        return null;
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

class NewIssueForm extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.createIssueCallBack}>
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
}

function LoaderWidget(props) {
    return (
        <img src={loader_gif} width="50" alt="loading..." />
    )
}