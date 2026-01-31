<?php
require_once 'check_admin.php';
require_once '../../config/db.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit();
}

$id = $conn->real_escape_string($data['id']);

// Prevent deleting self
if ($id == $_SESSION['user_id']) {
    echo json_encode(["success" => false, "message" => "You cannot delete yourself"]);
    exit();
}

$sql = "DELETE FROM users WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "User deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting user: " . $conn->error]);
}

$conn->close();
?>
