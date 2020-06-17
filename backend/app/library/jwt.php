<?php

namespace IssueTracker;

require(__DIR__ . "/../../vendor/firebase/php-jwt/src/JWT.php");

class JWT {
    const PRIVATE_KEY_PATH = __DIR__ . "/../keys/jwtRS256key";
    const PUBLIC_KEY_PATH = __DIR__ . "/../keys/jwtRS256key.pub";
 
    static $private_key;
    static $public_key;

    static function initialize() {
        self::$private_key = file_get_contents(self::PRIVATE_KEY_PATH);
        self::$public_key = file_get_contents(self::PUBLIC_KEY_PATH);
    }

    static function generate_token ($payload) {
        $jwt = \Firebase\JWT\JWT::encode($payload, self::$private_key, 'RS256');
        return $jwt;
    }

    static function decode_token ($token) {
        $decoded = \Firebase\JWT\JWT::decode($token, self::$public_key, ['RS256']);
    }
}

JWT::initialize();

?>