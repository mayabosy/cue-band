<?php
/**
 * 
 * Register
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

namespace App\EndpointControllers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Register extends Endpoint {
    public function __construct()
    { 
        switch(\App\Request::method()) 
        {
            case 'POST':
                $data = $this->addUser();
                break;
            default:
                throw new \App\ClientError(405);
                break;
        }
        parent::__construct($data);
    }

    private function name() 
    {
        if (!isset(\App\REQUEST::params()['name']))
        {
            throw new \App\ClientError(444);
        }
 
       $name = \App\REQUEST::params()['name'];
       return htmlspecialchars($name);
    }


    private function email() 
    {
        if (!isset(\App\REQUEST::params()['email']))
        {
            throw new \App\ClientError(446);
        }
 
       $email = \App\REQUEST::params()['email'];
       return htmlspecialchars($email);
    }

  
    private function password() 
    {
        if (!isset(\App\REQUEST::params()['password']))
        {
            throw new \App\ClientError(448);
        }
 
       $password = \App\REQUEST::params()['password'];
       return htmlspecialchars($password);
    }


    private function emailExists($email) 
    {
        $dbConn = new \App\Database(MAIN_DATABASE);
        $sql = "SELECT COUNT(*) AS count FROM user WHERE email = :email";
        $sqlParams = [':email' => $email];
        $result = $dbConn->executeSQL($sql, $sqlParams); // Execute the SQL query
        $count = $result[0]['count']; // Get the count from the result
        return $count > 0; // Return true if count is greater than 0
    }
    
    private function addUser()
    { 
        $email = $this->email();
        $password = $this->password();
        $name = $this->name();
        $dbConn = new \App\Database(MAIN_DATABASE);
        
        // Check if email already exists
        if ($this->emailExists($email)) {
            throw new \App\ClientError(450, "Email already exists");
        }


        // Prepare SQL query with parameters
        $sql = "INSERT INTO user (email, name, password) VALUES (:email, :name, :password)";
        $sqlParams = [
            ':email' => $email,
            ':name' => $name,
            ':password' => $password,
        ];
        $data = $dbConn->executeSQL($sql, $sqlParams);
        return [];
    }
}
