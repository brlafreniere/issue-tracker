import React from "react";

export default class ErrorMessages extends React.Component {
    render() {
        if (this.props.errorMessages.length > 0) {
            return (
                <div className="alert alert-danger">
                    <div>There were some errors with your submission:</div>
                    <ul>
                        {this.props.errorMessages.map( (error, i) => (
                            <li key={i}>
                                {error.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
        return null;
    }
}