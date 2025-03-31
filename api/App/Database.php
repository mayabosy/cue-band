<?php
/**
 * 
 * Database
 *
 * @author Maja Bosy
 * Student ID: W20037161
 * 
*/

namespace App;

class Database 
{
    private $dbConnection;

    public function __construct($dbName) 
    {
        $this->setDbConnection($dbName);  
    }

    private function setDbConnection($dbName) 
    {
        $this->dbConnection = new \PDO('sqlite:'.$dbName);
        $this->dbConnection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }
    
    public function executeSQL($sql, $params=[])
    { 
        $stmt = $this->dbConnection->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function beginTransaction()
    {
        $this->setDbConnection->beginTransaction();
    }

    public function commit()
    {
        $this->setDbConnection->commit();        
    }

    public function rollback()
    {
        $this->setDbConnection->rollback();
    }

    public function lastInsertId()
    {
        return $this->setDbConnection->lastInsertId();
    }
}
