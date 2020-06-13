<?php

class Users extends \Phalcon\Mvc\Model
{
    public $id;
    public $first_name;
    public $last_name;
    public $email_address;
    public $password_digest;
    public $created_at;
    public $password;

    public function initialize() {
        $this->setSchema("issue_tracker");
        $this->setSource("users");
    }

    public static function find($parameters = null): \Phalcon\Mvc\Model\ResultsetInterface {
        return parent::find($parameters);
    }

    public static function findFirst($parameters = null) {
        return parent::findFirst($parameters);
    }

    public function beforeValidation() {
        $this->created_at = new \Phalcon\Db\RawValue('FROM_UNIXTIME()'); 
        $this->generatePasswordHash();
    }

    public function generatePasswordHash() {
        $this->password_digest = password_hash($this->password, PASSWORD_BCRYPT);
    }
}
