<?php
$host = "localhost";
$user = "root";        // default for XAMPP
$pass = "";            // default for XAMPP
$db   = "tinker_garden";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die("Database connection failed: " . $conn->connect_error);
}
