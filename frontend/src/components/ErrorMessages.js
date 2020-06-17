import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../App";

const ErrorMessages = (props) => {
    const appContext = useContext(AppContext)

    useEffect(() => {
        appContext.setMessagesRendered(true)
    }, [])

    if (props.errors) {
        return (
            <div className="alert alert-danger">
                <div>There were some errors with your submission:</div>
                <ul>
                    {props.errors.map( (error, i) => (
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

export default ErrorMessages