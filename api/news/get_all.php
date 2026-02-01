<?php
require_once '../../config/db.php';

header("Content-Type: application/json");

$sql = "SELECT n.id, n.title, n.content, n.image, n.pdf_file, 
               n.created_at, n.updated_at,
               u1.full_name as created_by_name, u1.email as created_by_email,
               u2.full_name as updated_by_name, u2.email as updated_by_email
        FROM news n
        LEFT JOIN users u1 ON n.created_by = u1.id
        LEFT JOIN users u2 ON n.updated_by = u2.id
        ORDER BY n.created_at DESC";
$result = $conn->query($sql);

$news = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $news[] = $row;
    }
}

echo json_encode(["success" => true, "news" => $news]);

$conn->close();
?>
