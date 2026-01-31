<?php
$host = "localhost";
$user = "root";        // default for XAMPP
$pass = "";            // default for XAMPP
$db   = "l12_crud";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die("Database connection failed: " . $conn->connect_error);
}
