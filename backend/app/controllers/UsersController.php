<?php
declare(strict_types=1);

require_once("../app/library/logger.php");

use Phalcon\Helper\Json;

class UsersController extends ControllerBase {
    public function indexAction() {

    }

    public function createAction() {
        $this->view->disable();

        $formData = $this->request->getJsonRawBody();

        $user = new Users();

        $user->first_name = $formData->first_name;
        $user->last_name = $formData->last_name;
        $user->email_address = $formData->email_address;
        $user->password = $formData->password;

        try {
            $result = $user->save();
            echo Json::encode($result);
        } catch (Exception $e) { 
            debug($e);
        }
    }
}

