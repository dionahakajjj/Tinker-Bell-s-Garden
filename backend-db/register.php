<?php
require "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  header('Content-Type: application/json; charset=utf-8');

  $name     = trim($_POST["name"]);
  $email    = trim($_POST["email"]);
  $password = $_POST["password"];
  $confirm  = $_POST["confirm"];

  // Basic validation
  if (strlen($name) < 2) {
    echo json_encode(["error" => "Name too short"]);
    exit;
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "Invalid email"]);
    exit;
  }

  if (strlen($password) < 6) {
    echo json_encode(["error" => "Password too short"]);
    exit;
  }

  if ($password !== $confirm) {
    echo json_encode(["error" => "Passwords do not match"]);
    exit;
  }

  // Check if email already exists
  $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
  $check->bind_param("s", $email);
  $check->execute();
  $check->store_result();

  if ($check->num_rows > 0) {
    echo json_encode(["error" => "Email already registered"]);
    exit;
  }

  // Hash password
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  // Insert user
  $stmt = $conn->prepare(
    "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)"
  );
  $stmt->bind_param("sss", $name, $email, $hashedPassword);

  if ($stmt->execute()) {
    echo json_encode(["success" => "Account created"]);
    exit;
  } else {
    http_response_code(500);
    echo json_encode(["error" => "Something went wrong"]);
    exit;
  }
}
