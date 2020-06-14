import React from "react";

import loader_gif from "./loader.gif";
import "./LoaderWidget.css";

export default function LoaderWidget(props) {
    return (
        <img class='loader-widget' src={loader_gif} width="150" alt="loading..." />
    )
}