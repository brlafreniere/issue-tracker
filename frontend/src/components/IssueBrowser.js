import React, { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
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
import { AppContext } from "../App"

const NewIssueForm = (props) => {
    const appContext = useContext(AppContext)
    const history = useHistory();

    const createIssue = (event) => {
        event.preventDefault()
        appContext.setLoaded(false)

        let payload = {
            title: event.target.title.value,
            body: event.target.body.value }

        Issues.create(payload)
            .then(response => { 
                props.refreshIssues()
                history.push('/')
            })
            .catch(error => { console.log(error) })
    }

    return (
        <form onSubmit={createIssue}>
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
    const appContext = useContext(AppContext)
    const history = useHistory()
    let {id} = useParams()

    let issue = props.issues.find(issue => issue.id === id)

    const deleteIssue = (issue_id) => {
        appContext.setLoaded(false)

        Issues.delete(issue_id)
            .then(response => { 
                props.refreshIssues() 
                history.push('/')
            })
    }

    if (issue) {
        return (
            <div>
                <h1 className="card-title">{issue.title}</h1>
                <p className="card-text">{issue.body}</p>
                <button className="btn btn-primary" onClick={(e) => deleteIssue(issue.id)}>Delete</button>
            </div>
        )
    } else {
        return null
    }
}


const IssueList = (props) => {
    const IssueListItem = (props) => {
        return (
            <li className="list-group-item" key={props.issue.id}>
                <Link to={"/issues/" + props.issue.id}>{props.issue.title}</Link>
            </li>
        )
    }

    if (props.issues.length > 0) {
        return (
            <ul className="list-group list-group-flush">
                {props.issues.map(issue => <IssueListItem key={issue.id} issue={issue} />)}
            </ul>
        )
    } else {
        return (<div>Looks like there aren't any issues.</div>)
    }
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


const IssueBrowser = (props) => {
    const appContext = useContext(AppContext)

    let [issues, setIssues] = useState([])
    let [loaded, setLoaded] = useState(false)
    let [noResponse, setNoResponse] = useState(false)

    const refreshIssues = () => {
        Issues.getAll()
            .then(issues => {
                setIssues(issues)
                setLoaded(true)
                appContext.setLoaded(true)
             })
            .catch(error => {
                if (!error.response) { 
                    setNoResponse(true)
                }
                appContext.setLoaded(true)
            })
    }

    useEffect(() => {
        if (!loaded) { refreshIssues() }
    })

    const MainSwitch = (props) => {
        return (
            <Switch>
                <Route exact path="/users/registration">
                    <UserRegistration />
                </Route>

                <Route exact path="/issues/create/">
                    <NewIssueForm refreshIssues={refreshIssues} />
                </Route>

                <Route exact path="/issues/:id">
                    <IssueDetail issues={issues} refreshIssues={refreshIssues} />
                </Route>

                <Route exact path="/">
                    <IssueList issues={issues} />
                </Route>

            </Switch>
        )
    }

    return (
        <div className="mt-5">
            <Navigation />
            <NoResponseFromServer noResponse={noResponse} />
            <div className="p-3 border border-top-0 rounded-bottom">
                <MainSwitch />
            </div>
        </div>
    )
}

export default IssueBrowser

const UserRegistration = (props) => {
    const appContext = useContext(AppContext)
    const [ , setCookie, ] = useCookies(['auth-token']);

    useEffect(() => {
        return () => {
            if (appContext.messagesRendered) {
                appContext.setErrors(null)
                appContext.setStatusMessage(null)
                appContext.setMessagesRendered(null)
            }
        }
    }, [])

    const registerUser = (event) => {
        event.preventDefault()
        appContext.setLoaded(false)

        let payload = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email_address: event.target.email_address.value,
            password: event.target.password.value }

        Users.create(payload)
            .then(response => { 
                setCookie('auth-token', response.jwt)
                appContext.setStatusMessage({type: "success", text: "User successfully registered."})
                appContext.setLoaded(true)
            })
            .catch(error => { 
                console.log(error.response)
                if (error.response.data.messages) { appContext.setErrors(error.response.data.messages) }
                appContext.setLoaded(true)
            })
    }

    return (
        <form onSubmit={registerUser}>
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