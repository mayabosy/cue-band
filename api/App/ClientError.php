<?php 
/**
 * 
 * Client Error
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/
namespace App;


class ClientError extends \Exception
{
    public function __construct($code)
    {
        parent::__construct($this->errorResponses($code));
    }

    public function errorResponses($code)
    {
        switch ($code) {
            case 204:
                http_response_code(204);
                $message = 'No Content';
                break;
            case 400:
                http_response_code(400);
                $message = 'Bad Request';
                break;
            case 401:
                http_response_code(401);
                $message = 'Unauthorized';
                break;
            case 403:
                http_response_code(403);
                $message = 'Forbidden';
                break;
            case 404:
                http_response_code(404);
                $message = 'Endpoint Not Found';
                break;
            case 405:
                http_response_code(405);
                $message = 'Method Not Allowed';
                break;
            case 444:
                http_response_code(444);
                $message = 'Unprocessable name';
            case 408:
                http_response_code(408);
                $message = 'The note is too long!';
                break;  
            default:
                throw new \Exception('Internal Server Error');
        }
        return $message;
    }
}
