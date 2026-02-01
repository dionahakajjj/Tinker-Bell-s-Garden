<?php
require_once 'check_admin.php';
require_once '../../config/db.php';

header("Content-Type: application/json");

$sql = "SELECT id, full_name as name, email, role, created_at FROM users ORDER BY created_at DESC";
$result = $conn->query($sql);

$users = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode(["success" => true, "users" => $users]);

$conn->close();
?>
