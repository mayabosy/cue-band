<?php
/**
 * 
 * Request
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

namespace App;


abstract class Request 
{
    public static function method()
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    /**
     * Endpoint
     * 
     * Return the name of the requested endpoint.
     */
    public static function endpointName()
    {
        $url = rtrim($_SERVER["REQUEST_URI"],"/");
        $path = parse_url($url)['path'];
        return str_replace(BASEPATH, "", $path);
    }

    /**
     * Params
     * 
     * Return the request parameters and makes them case insensitive.
     */
    public static function params()
    {
        return array_change_key_case($_REQUEST, CASE_LOWER);
    }

    public static function getBearerToken()
    {
        $allHeaders = getallheaders();
        $authorizationHeader = "";

        if (array_key_exists('Authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['Authorization'];
        } elseif (array_key_exists('authorization', $allHeaders)) {
            $authorizationHeader = $allHeaders['authorization'];
        }

        if (substr($authorizationHeader, 0, 7) != 'Bearer ') {
            throw new \App\ClientError(401);
        }

        return trim(substr($authorizationHeader, 7));
    }

    public static function checkUserExists($id)
    {
        $dbConn = new \App\Database(MAIN_DATABASE);
        $sql = "SELECT id FROM account WHERE id = :id";
        $sqlParams = [':id' => $id];
        $data = $dbConn->executeSQL($sql, $sqlParams);
        if (count($data) != 1) {
            throw new \App\ClientError(404);
        }
    }
    
}
