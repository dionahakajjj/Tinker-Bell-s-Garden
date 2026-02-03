<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tinker_garden"; // Make sure this matches your phpMyAdmin database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
