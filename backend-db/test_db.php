<?php
// Quick DB connectivity and data check script
// Usage: open in browser at /backend-db/test_db.php or run via CLI
require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

$out = [
  'connected' => false,
  'database' => $db ?? null,
  'users_count' => null,
  'sample_user' => null,
];

try {
  if ($conn && $conn->connect_errno === 0) {
    $out['connected'] = true;

    // Check users table existence and row count
    $res = $conn->query("SELECT COUNT(*) as cnt FROM users");
    if ($res) {
      $row = $res->fetch_assoc();
      $out['users_count'] = (int)$row['cnt'];
    } else {
      $out['users_count'] = 'users table not found';
    }

    // fetch one sample user if exists
    $res2 = $conn->query("SELECT id, full_name, email, created_at FROM users ORDER BY id DESC LIMIT 1");
    if ($res2 && $res2->num_rows > 0) {
      $out['sample_user'] = $res2->fetch_assoc();
    }
  } else {
    $out['error'] = 'Connection object missing or error';
  }
} catch (Exception $e) {
  $out['error'] = $e->getMessage();
}

echo json_encode($out, JSON_PRETTY_PRINT);

