<?php
/**
 * 
 * Exception Handler
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

function exceptionHandler($e) {
    http_response_code(500);
    $output['message'] = "Internal Server Error";
    $output['details']['exception'] = $e->getMessage();
    $output['details']['file'] = $e->getFile();
    $output['details']['line'] = $e->getLine();
    echo json_encode($output);
    exit();
}