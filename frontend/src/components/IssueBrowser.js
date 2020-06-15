import React, { useContext } from "react"
import Issues from "../modules/issues"
import Users from "../modules/user"

import {
    Switch,
    Route,
    NavLink,
    Link,
    useParams,
    useHistory
} from "react-router-dom"

import "./IssueBrowser.css";
import AppContext from "../AppContext"

const IssueBrowserContext = React.createContext();

export default function IssueBrowserWithHistory(props) {
    let history = useHistory()
    return (<IssueBrowser history={history} />)
}

const NewIssueForm = (props) => {
    const context = useContext(IssueBrowserContext)
    return (
        <form onSubmit={context.createIssue}>
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
    const context = useContext(IssueBrowserContext)
    let {id} = useParams()
    let issue = context.issues.find(issue => issue.id === id)

    if (issue) {
        return (
            <div>
                <h1 className="card-title">{issue.title}</h1>
                <p className="card-text">{issue.body}</p>
                <button className="btn btn-primary" onClick={(e) => context.deleteIssue(issue.id)}>Delete</button>
            </div>
        )
    } else {
        return null
    }
}

const IssueListItem = (props) => {
    return (
        <li className="list-group-item" key={props.issue.id}>
            <Link to={"/issues/" + props.issue.id}>{props.issue.title}</Link>
        </li>
    )
}

const IssueList = (props) => {
    const context = useContext(IssueBrowserContext)
    return (
        <ul className="list-group list-group-flush">
            {context.issues.map(issue => <IssueListItem key={issue.id} issue={issue} />)}
        </ul>
    )
}

const MainSwitch = (props) => {
    return (
        <Switch>
            <Route exact path="/users/registration">
                <UserRegistrationWithHistory />
            </Route>

            <Route exact path="/issues/create/">
                <NewIssueForm />
            </Route>

            <Route exact path="/issues/:id">
                <IssueDetail />
            </Route>

            <Route exact path="/">
                <IssueList />
            </Route>

        </Switch>
    )
}

const NoResponseFromServer = (props) => {
    if (props.noResponse) {
        return (
            <div className="alert alert-danger">
                No response received from server. Is it running?
            </div>
        )
    } else {
        return null;
    }
}

const Navigation = (props) => {
    return (
        <nav className="nav nav-tabs">
            <li className="nav-item"><NavLink to="/" exact={true} className="nav-link" activeClassName="active">All</NavLink></li>
            <li className="nav-item"><NavLink to="/issues/create/" className="nav-link" activeClassName="active">New</NavLink></li>
            <li className="nav-item"><NavLink to="/users/registration/" className="nav-link" activeClassName="active">Register</NavLink></li>
        </nav>
    )
}


class IssueBrowser extends React.Component {
    static contextType = AppContext

    deleteIssue = (issue_id) => {
        this.context.setLoaded(false)

        Issues.delete(issue_id)
            .then(response => { 
                this.refreshIssues() 
                this.props.history.push('/')
            })
    }

    createIssue = (event) => {
        event.preventDefault()
        this.context.setLoaded(false)

        let payload = {
            title: event.target.title.value,
            body: event.target.body.value }

        Issues.create(payload)
            .then(response => { 
                this.refreshIssues()
                this.props.history.push('/')
            })
            .catch(error => { console.log(error) })
    }

    state = {
        issues: [],
        noResponse: false,

        createIssue: this.createIssue,
        deleteIssue: this.deleteIssue,
    }

    render() {
        return (
            <div className="mt-5">
                <Navigation />
                <NoResponseFromServer noResponse={this.state.noResponse} />
                <div className="p-3 border border-top-0 rounded-bottom">
                    <IssueBrowserContext.Provider value={this.state}>
                        <MainSwitch />
                    </IssueBrowserContext.Provider>
                </div>
            </div>
        )
    }

    refreshIssues = () => {
        Issues.getAll()
            .then(issues => {
                this.setState({issues})
                this.context.setLoaded(true)
             })
            .catch(error => {
                if (!error.response) { 
                    this.setState({noResponse: true})
                }
                this.context.setLoaded(true)
            })
    }

    componentDidMount() {
        this.refreshIssues()
    }
}

function UserRegistrationWithHistory(props) {
    let history = useHistory();
    return (<UserRegistration history={history} />)
}

class UserRegistration extends React.Component {
    static contextType = AppContext

    registerUser = (event) => {
        event.preventDefault()
        this.context.setLoaded(false)

        // TODO: check if password matches confirmation, display error message
        // if it doesn't

        let payload = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email_address: event.target.email_address.value,
            password: event.target.password.value }

        Users.create(payload)
            .then(response => { 
                this.context.setStatusMessage("success", "User successfully registered.")
                this.context.setLoaded(true)
            })
            .catch(error => { 
                if (error.response.data.messages) { this.context.setErrorMessages(error.response.data.messages) }
                this.context.setLoaded(true)
            })

        this.setState({redirect: true})
    }

    componentWillUnmount() {
        this.context.clearAllMessages()
    }

    componentDidMount() {
        this.context.clearAllMessages()
    }

    render() {
        return (
            <form onSubmit={this.registerUser}>
                <div className="form-group">
                    <label htmlFor="first_name">First Name:</label>
                    <input name="first_name" type="text" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Last Name:</label>
                    <input name="last_name" type="text" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="email_address">Email Address:</label>
                    <input name="email_address" type="text" className="form-control" />
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