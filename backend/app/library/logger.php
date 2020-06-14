<?php

use Phalcon\Logger\AdapterFactory;
use Phalcon\Logger\LoggerFactory;


class AppLogger {
    public static $logger = null;

    public static function initialize() {
        if (self::$logger == null) {
            $config = [
                "name"     => "debug-logger",
                "adapters" => [
                    "main"  => [
                        "adapter" => "stream",
                        "name"    => "../logs/debug.log",
                        "options" => []
                    ]
                ],
            ];

            $adapterFactory = new AdapterFactory();
            $loggerFactory  = new LoggerFactory($adapterFactory);

            self::$logger = $loggerFactory->load($config);
        }
    }
}

AppLogger::initialize();

function debug($thing) {
    AppLogger::$logger->debug(print_r($thing, true));
}

?>