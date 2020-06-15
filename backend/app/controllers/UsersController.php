<?php
declare(strict_types=1);

require_once("../app/library/logger.php");
require_once("../app/library/jwt.php");

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
            if ($result === false) {
                $this->response->setStatusCode(422);
                $messages = $user->getMessages();
                echo Json::encode(["messages" => $messages]);
            } else {
                $payload = ["user_id" => $user->id];
                $jwt = IssueTracker\JWT::generate_token($payload);
                $JSONResponse = Json::encode(["jwt" => $jwt]);
                echo $JSONResponse;
            }
        } catch (Exception $e) { 
            debug($e);
            
            // 1062: duplicate entry primary index (email address)
            if ($e->errorInfo[1] == 1062) {
                $this->response->setStatusCode(422);
                echo Json::encode(["messages" => [["message" => "Email address already taken."]] ]);
            }
        }
    }
}

