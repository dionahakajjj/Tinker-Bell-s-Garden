<?php
require_once 'check_admin.php';
require_once '../../config/db.php';

header("Content-Type: application/json");

$sql = "SELECT id, name, email, message, read, created_at 
        FROM contact_submissions 
        ORDER BY created_at DESC";
$result = $conn->query($sql);

$submissions = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $submissions[] = $row;
    }
}

echo json_encode(["success" => true, "submissions" => $submissions]);

$conn->close();
?>
