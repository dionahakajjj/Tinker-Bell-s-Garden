<?php
session_start();
require_once '../../config/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

$name = trim($_POST["name"] ?? "");
$description = trim($_POST["description"] ?? "");
$price = isset($_POST["price"]) ? floatval($_POST["price"]) : null;
$user_id = $_SESSION['user_id'];
$image_path = null;
$pdf_path = null;

// Validation
if (strlen($name) < 3) {
    echo json_encode(["success" => false, "error" => "Name must be at least 3 characters"]);
    exit;
}

if (strlen($description) < 10) {
    echo json_encode(["success" => false, "error" => "Description must be at least 10 characters"]);
    exit;
}

// Handle image upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = '../../uploads/products/images/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $file_ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (in_array($file_ext, $allowed_exts)) {
        $file_name = uniqid() . '_' . time() . '.' . $file_ext;
        $file_path = $upload_dir . $file_name;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
            $image_path = 'uploads/products/images/' . $file_name;
        }
    }
}

// Handle PDF upload
if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = '../../uploads/products/pdfs/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $file_ext = strtolower(pathinfo($_FILES['pdf_file']['name'], PATHINFO_EXTENSION));
    
    if ($file_ext === 'pdf') {
        $file_name = uniqid() . '_' . time() . '.pdf';
        $file_path = $upload_dir . $file_name;
        
        if (move_uploaded_file($_FILES['pdf_file']['tmp_name'], $file_path)) {
            $pdf_path = 'uploads/products/pdfs/' . $file_name;
        }
    }
}

// Insert into database
$stmt = $conn->prepare(
    "INSERT INTO products (name, description, price, image, pdf_file, created_by) VALUES (?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssdssi", $name, $description, $price, $image_path, $pdf_path, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Product created successfully", "id" => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to create product"]);
}

$stmt->close();
$conn->close();
?>
