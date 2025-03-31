<?php
/**
 * 
 * Autoloader
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

function autoloader($className) {
    $filename = $className . ".php";
    $filename = str_replace('\\', DIRECTORY_SEPARATOR, $filename);
    if (is_readable($filename)) {
        require $filename;
    } else {
        throw new Exception("File not found: " . $className ."(". $filename . ")");
    }
}