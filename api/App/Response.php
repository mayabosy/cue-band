<?php
/**
 * 
 * Response
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

namespace App;

class Response
{
    public function __construct()
    {
        $this->outputHeaders();

        if(Request::method() === 'OPTIONS'){
            exit();
        }
    }
    
    private function outputHeaders()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
    }

    public function outputJSON($data)
    {
        if (empty($data)) {
            http_response_code(204);
        }
        echo json_encode($data);
    }

}
