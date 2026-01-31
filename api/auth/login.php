<?php
session_start();
require_once '../../config/db.php';

header("Content-Type: application/json");

// Allow CORS if testing from different origin, but typically same origin is enough
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit();
}

$email = $conn->real_escape_string($data->email);
$password = $data->password;

$sql = "SELECT id, name, email, password, role FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
        exit();
    }
}

http_response_code(401);
echo json_encode(["success" => false, "message" => "Invalid email or password"]);

$conn->close();
?>
