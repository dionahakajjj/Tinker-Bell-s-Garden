<?php
require_once '../../config/db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$message = trim($_POST["message"] ?? "");

// Validation
if (strlen($name) < 2) {
    echo json_encode(["success" => false, "error" => "Name must be at least 2 characters"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "Invalid email address"]);
    exit;
}

if (strlen($message) < 10) {
    echo json_encode(["success" => false, "error" => "Message must be at least 10 characters"]);
    exit;
}

// Insert into database
$stmt = $conn->prepare(
    "INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("sss", $name, $email, $message);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thank you! Your message was sent successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to save message"]);
}

$stmt->close();
$conn->close();
?>
