<?php

namespace App\Config\Database;

class Database {
    private $host = 'localhost';
    private $database = 'test';
    private $username;
    private $password;
    private $dsn;
    private $production;
    public $results = array();

    function __construct() {
        $this->username = $_ENV['USERNAME'];
        $this->password = $_ENV['PASSWORD'];

        try {
            $this->dsn = new \PDO('mysql:host=' . $this->host . ';dbname=' . $this->database . ';charset=utf8;', $this->username, $this->password);
        } catch(Exception $error) {
            echo $error->getMessage();
        }
    }

    function connect(string $sql, array $params = array()) : array {
        $count = 1;
        $stmt = $this->dsn->prepare($sql);

        foreach($params as $param) {
            $stmt->bindValue($count, $param);
            $count++;
        }

        $stmt->execute();

        while($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            array_push($this->results, $row);
        }

        return $this->results;
    }
}