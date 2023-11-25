<?php
require_once('db.php');
dbInit();

if (isset($_GET['n']) && isset($_GET['s'])) {
    $name = base64_decode($_GET['n']);
    if ($name === FALSE) die('name error');
    $score = base64_decode($_GET['s']);
    if ($score === FALSE) die('score error');
    $name = substr($name, 0, 128);
    $score = intval($score);
    dbSaveScore($score, $name, time());
}

dbClose();
