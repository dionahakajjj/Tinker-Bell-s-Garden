<?php
session_start();
require "db.php";

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

/* ===============================
   READ BODY (JSON or FORM)
   =============================== */
$email = "";
$password = "";

if (!empty($_POST)) {
    $email = trim($_POST["email"] ?? "");
    $password = $_POST["password"] ?? "";
} else {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON or form data"]);
        exit;
    }

    $email = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";
}

if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["error" => "Email and password required"]);
    exit;
}

/* ===============================
   QUERY USER
   =============================== */
$stmt = $conn->prepare("
    SELECT id, full_name, email, password, COALESCE(role, 'user') AS role
    FROM users
    WHERE email = ?
    LIMIT 1
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user["password"])) {
    http_response_code(401);
    echo json_encode(["error" => "Wrong password"]);
    exit;
}

/* ===============================
   LOGIN OK
   =============================== */
$_SESSION["user_id"] = $user["id"];
$_SESSION["name"]    = $user["full_name"];
$_SESSION["email"]   = $user["email"];
$_SESSION["role"]    = $user["role"];

echo json_encode([
    "success" => true,
    "user" => [
        "id"    => $user["id"],
        "name"  => $user["full_name"],
        "email" => $user["email"],
        "role"  => $user["role"]
    ]
]);
