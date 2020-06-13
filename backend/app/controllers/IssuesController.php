<?php
declare(strict_types=1);

require_once("../app/library/logger.php");
require_once("../app/models/Issues.php");

use Phalcon\Helper\Json;
use Phalcon\Http\Request;
use Phalcon\Http\Response;

use IssueTracker\Models\Issues;

class IssuesController extends \Phalcon\Mvc\Controller {
    public function indexAction() {
        $this->view->disable();

        $issues = Issues::find();

        echo Json::encode($issues);
    }

    public function createAction() {
        $this->view->disable();

        $formData = $this->request->getJsonRawBody();

        $issue = new Issues();

        $issue->title = $formData->title;
        $issue->body = $formData->body;

        $result = $issue->save();

        echo Json::encode($result);
    }

    public function deleteAction() {
        $this->view->disable();

        $id = $this->dispatcher->getParam('id');

        $issue = Issues::findFirst("id = $id");

        if ($issue) {
            $result = $issue->delete();
            echo Json::encode($result);
        } else {
            $this->response->setStatusCode(404);
        }
    }
}

