<?php
declare(strict_types=1);

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

        $result = $user->save();
    }
}

