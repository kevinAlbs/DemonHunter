<?php

$db = NULL;

function dbInit() {
    global $db;
    // Create/open the database
    $db = new SQLite3('demonHunter.db');

    // Create a table
    $query = "CREATE TABLE IF NOT EXISTS scores (
        name TEXT,
        score INTEGER,
        date INTEGER
    )";
    $db->exec($query);
}

function dbClose() {
    global $db;
    $db->close();
}


function dbSaveScore($score, $name, $date) {
    global $db;
    // Insert data into the table
    $stmt = $db->prepare("INSERT INTO scores (name, score, date) VALUES (:name, :score, :date)");
    $stmt->bindValue(":name", $name, SQLITE3_TEXT);
    $stmt->bindValue(":score", $score, SQLITE3_INTEGER);
    $stmt->bindValue(":date", $date, SQLITE3_INTEGER);
    $res = $stmt->execute();
    if (!$res) {
        die ("Failed to insert into database");
    }
}

function dbGetScores() {
    global $db;
    $stmt = $db->prepare("SELECT * FROM scores ORDER BY score DESC LIMIT 100");
    return $stmt->execute();
}