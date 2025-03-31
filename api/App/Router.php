<?php
/**
 * 
 * Router
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

namespace App;

abstract class Router
{
    public static function routeRequest()
    {
        $requestedEndpoint = strtolower(Request::endpointName());
        try
        {
            switch ($requestedEndpoint) {
                case '':
                case '/diary':
                case '/diary/':
                    $endpoint = new EndpointControllers\Diary();
                    break;
                case '/register':
                case '/register/':
                    $endpoint = new EndpointControllers\Register();
                    break;
                case '/token':
                case '/token/':
                    $endpoint = new EndpointControllers\Token();
                    break;               
                default:
                    throw new ClientError(404);
            }
        } catch (ClientError $e) {
            $data = ['message' => $e->getMessage()];
            $endpoint = new EndpointControllers\Endpoint($data);
        }
        return $endpoint;
    }
}