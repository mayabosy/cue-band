<?php
/**
 * 
 * Api
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require "config/settings.php";
require "config/autoloader.php";
require "config/exceptionHandler.php";

set_exception_handler('exceptionHandler');
spl_autoload_register("autoloader");

$response = new App\Response();
$endpoint = App\Router::routeRequest();
$data = $endpoint->getData();

$response->outputJSON($data);
