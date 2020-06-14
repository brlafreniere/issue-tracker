import React from "react"
import { Redirect } from "react-router-dom"

import Users from "../modules/user"

import AppContext from "../AppContext"

export default class UserRegistration extends React.Component {
    state = {
        redirect: false }
    static contextType = AppContext

    registerUser = (event) => {
        event.preventDefault()

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
                this.context.setLoading(false)
            })
            .catch(error => { console.log(error) })

        this.setState({redirect: true})
        this.context.setLoading(true)
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
    }

    render() {
        return (
            <form onSubmit={this.registerUser}>
                {this.renderRedirect()}
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