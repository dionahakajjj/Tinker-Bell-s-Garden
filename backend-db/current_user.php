<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

if (empty($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "user" => null]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $_SESSION['user_id'],
        "name" => $_SESSION['name'] ?? "",
        "email" => $_SESSION['email'] ?? "",
        "role" => $_SESSION['role'] ?? "user"
    ]
]);
