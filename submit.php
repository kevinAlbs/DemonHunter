<?php
require_once('mysqlconfig.php');
if (isset($_GET['n']) && isset($_GET['s'])) {
    $file = fopen('scores.txt', 'a');
    if ($file === FALSE) die('file error');
    $name = base64_decode($_GET['n']);
    if ($name === FALSE) die('name error');
    $score = base64_decode($_GET['s']);
    if ($score === FALSE) die('score error');
    $name = mysqli_real_escape_string($cxn, substr($name, 0, 128));
    $score = intval($score);
    mysqli_query($cxn, sprintf("INSERT INTO scores (`name`, `score`) VALUES('%s', %d)", $name, $score)) or die("Query failed");
}