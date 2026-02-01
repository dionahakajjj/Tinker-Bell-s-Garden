<?php
require_once '../../config/db.php';

header("Content-Type: application/json");

$sql = "SELECT p.id, p.name, p.description, p.price, p.image, p.pdf_file,
               p.created_at, p.updated_at,
               u1.full_name as created_by_name, u1.email as created_by_email,
               u2.full_name as updated_by_name, u2.email as updated_by_email
        FROM products p
        LEFT JOIN users u1 ON p.created_by = u1.id
        LEFT JOIN users u2 ON p.updated_by = u2.id
        ORDER BY p.created_at DESC";
$result = $conn->query($sql);

$products = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode(["success" => true, "products" => $products]);

$conn->close();
?>
