<?php
require_once '../config/db.php';

// Change these values to set your admin credentials
$name = "Admin User";
$email = "admin@tinkerbell.com";
$password = "admin123";
$role = "admin";

// Check if admin already exists
$check = $conn->query("SELECT id FROM users WHERE email = '$email'");
if ($check->num_rows > 0) {
    echo "Admin user already exists with email: $email\n";
    exit();
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (name, email, password, role) VALUES ('$name', '$email', '$hashed_password', '$role')";

if ($conn->query($sql) === TRUE) {
    echo "Admin user created successfully.\nEmail: $email\nPassword: $password\n";
} else {
    echo "Error: " . $sql . "\n" . $conn->error;
}

$conn->close();
?>
