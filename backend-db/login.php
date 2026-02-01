<?php
session_start();
require "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  header('Content-Type: application/json; charset=utf-8');

  $email    = trim($_POST["email"]);
  $password = $_POST["password"];

  $stmt = $conn->prepare("SELECT id, full_name, email, password, COALESCE(role, 'user') as role FROM users WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user["password"])) {
      $_SESSION["user_id"] = $user["id"];
      $_SESSION["name"] = $user["full_name"];
      $_SESSION["email"] = $user["email"];
      $_SESSION["role"] = $user["role"];

      echo json_encode(["success" => "Login successful"]);
      exit;
    } else {
      http_response_code(401);
      echo json_encode(["error" => "Wrong password"]);
      exit;
    }
  } else {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
  }
}
