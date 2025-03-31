<?php
/**
 * 
 * Token
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

namespace App\EndpointControllers;

 class Token extends Endpoint { 

    private $sqlUser = "SELECT user_id, password FROM user WHERE email = :email";

    private function generateJWT($id) { 
        $secretKey = SECRET;
        $time = time();
        $payload = [
            'id' => $id,
            'exp' => strtotime('+ 3 days', $time),
        ];
        
        $jwt = \Firebase\JWT\JWT::encode($payload, $secretKey, 'HS256');
        
        return $jwt;
    }
    
    public function __construct() {

        switch(\App\Request::method()){
            case 'GET':
            case 'POST':
                $this->checkAllowedParams();
                $dbConn = new \App\Database(MAIN_DATABASE);
                
                if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
                    throw new \App\ClientError(401);
                }

                if (empty(trim($_SERVER['PHP_AUTH_USER'])) || empty(trim($_SERVER['PHP_AUTH_PW']))) {
                    throw new \App\ClientError(401);
                }

                $email = $_SERVER['PHP_AUTH_USER'];
                $password = $_SERVER['PHP_AUTH_PW'];

                // Check if the user is a participant
                $data = $dbConn->executeSQL($this->sqlUser, [':email' => $email]);
                if (count($data) === 1 && password_verify($password, $data[0]['password'])) {
                    $token = $this->generateJWT($data[0]['user_id']);
                    $data = ['token' => $token];
                    parent::__construct($data);
                    break;
                }

                // If none of the above conditions match, authentication fails
                throw new \App\ClientError(401);
                break;

            default:
                throw new \App\ClientError(405);
                break;
        }
    }
}

