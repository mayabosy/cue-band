<?php
/**
 * 
 * Diary
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

namespace App\EndpointControllers;


class Diary extends Endpoint {
    public function __construct(){
        switch(\App\Request::method()) 
        {
            case 'GET':
                $data = $this->getDiary();
                break;
            case 'POST':
                $data = $this->postDiary();
                break;
            case 'PUT':
                $data = $this->updateDiary(); 
                break;   
            default:
                throw new \App\ClientError(405);
                break;
        }
        parent::__construct($data);
    }


    private function note() {
        if (!isset(\App\REQUEST::params()['note']))
        {
            throw new \App\ClientError(422);
        }
 
        if (mb_strlen(\App\REQUEST::params()['note']) > 500)
        {
            throw new \App\ClientError(408);
        }
 
       $note = \App\REQUEST::params()['note'];
       return htmlspecialchars($note);
    }

    private function date() {
        if (!isset(\App\REQUEST::params()['date']))
        {
            throw new \App\ClientError(422);
        }
 
        if (mb_strlen(\App\REQUEST::params()['date']) > 250)
        {
            throw new \App\ClientError(402);
        }
 
       $date = \App\REQUEST::params()['date'];
       return htmlspecialchars($date);
    }

    private function hour() 
    {
        if (!isset(\App\REQUEST::params()['hour']))
        {
            throw new \App\ClientError(422);
        }
 
        if (mb_strlen(\App\REQUEST::params()['hour']) > 50)
        {
            throw new \App\ClientError(402);
        }
 
       $hour = \App\REQUEST::params()['hour'];
       return htmlspecialchars($hour);
    }

    private function strength() 
    {
        if (!isset(\App\REQUEST::params()['strength']))
        {
            throw new \App\ClientError(422);
        }
 
       $strength = \App\REQUEST::params()['strength'];
       return htmlspecialchars($strength);
    }

    private function user() 
    {
        if (!isset(\App\REQUEST::params()['user']))
        {
            throw new \App\ClientError(422);
        }
 
       $user = \App\REQUEST::params()['user'];
       return htmlspecialchars($user);
    }


   private function diary_id() 
    {
        if (!isset(\App\REQUEST::params()['diary_id']))
        {
            throw new \App\ClientError(422);
        }
 
       $diary_id = \App\REQUEST::params()['diary_id'];
       return htmlspecialchars($diary_id);
    }

    private function getDiary() { 
        $user = $this->user();
        $sql = "SELECT  date, label, power, hour, note, user, diary_id
        FROM diary
        LEFT JOIN strength ON (diary.strength = strength.strength_id)
        LEFT JOIN user ON  (diary.user = user.user_id) WHERE user = :user";   
        $sqlParameters = ['user' => $user];
        $dbConn = new \App\Database(MAIN_DATABASE);
        $data = $dbConn->executeSQL($sql, $sqlParameters);
        return $data;
    }

    private function postDiary() {

        $note = $this->note();
        $date = $this->date();
        $hour = $this->hour();
        $strength = $this->strength();
        $user = $this->user();

        $dbConn = new \App\Database(MAIN_DATABASE);

        $sql = "INSERT INTO diary (note, date, hour, strength,  user) 
            VALUES (:note, :date, :hour, :strength, :user)";

        $sqlParameters = ['note' => $note, 'date' => $date, 'hour' => $hour, 
                         'strength' => $strength, 'user' => $user];
        $data = $dbConn->executeSQL($sql, $sqlParameters);
     
        return [];
    }

    private function updateDiary() {

        $note = $this->note();
        $user = $this->user();
        $diary_id = $this->diary_id();

        $dbConn = new \App\Database(MAIN_DATABASE);

        $sql = "UPDATE diary SET note = :note 
            WHERE user = :user 
            AND diary_id = :diary_id";

        $sqlParameters = ['note' => $note, 'user' => $user, 'diary_id' => $diary_id];
        $data = $dbConn->executeSQL($sql, $sqlParameters);

        return [];
    }
}

