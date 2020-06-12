<?php

$router = $di->getRouter();

// Define your routes here

$router->handle($_SERVER['REQUEST_URI']);

$router->addGet("/issues", [
    "controller" => "issues",
    "action" => "index"]);

$router->addPost("/issues", [
    "controller" => "issues",
    "action" => "create"]);

$router->addDelete("/issues/{id}", [
    "controller" => "issues",
    "action" => "delete"]);