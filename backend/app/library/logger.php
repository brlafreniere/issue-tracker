<?php

function debug($thing, $depth = 512) {
    $stderr = fopen('php://stderr', 'w');
    $json_result = json_encode($thing, JSON_PRETTY_PRINT, $depth);
    fwrite($stderr, "Debug: \n" . $json_result . "\n");
}

?>