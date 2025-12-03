<?php
// kickoff-api/auth.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['mode']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid request parameters."]);
    http_response_code(400);
    exit();
}

$mode = $data['mode'];
$email = $data['email'];
$password = $data['password'];

// ==========================
// ส่วนของการ SIGNUP
// ==========================
if ($mode === 'signup') {
    // 1. เช็คว่ามีอีเมลนี้หรือยัง
    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE email = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "DB Error: Prepare SELECT failed."]);
        exit();
    }
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Email already registered."]);
        exit();
    }

    // 2. เตรียมข้อมูล
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $userId = uniqid('user_');
    
    $name = $data['name'] ?? null;
    $age = $data['age'] ?? null;
    $height = $data['height'] ?? null;
    $weight = $data['weight'] ?? null;
    $default_avatar = 'https://picsum.photos/seed/default/100/100';

    // 3. บันทึกข้อมูล (INSERT)
    $sql = "INSERT INTO users (user_id, email, password_hash, name, avatar, age, height, weight) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "DB Error: Prepare INSERT failed."]);
        exit();
    }

    if ($stmt->execute([$userId, $email, $passwordHash, $name, $default_avatar, $age, $height, $weight])) {
        echo json_encode([
            "success" => true,
            "userId" => $userId,
            "email" => $email,
            "message" => "Registration successful.",
            "name" => $name,
            "age" => $age,
            "height" => $height,
            "weight" => $weight,
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Registration failed: Database execute error."]);
    }

// ==========================
// ส่วนของการ LOGIN
// ==========================
} elseif ($mode === 'login') {
    $stmt = $pdo->prepare("SELECT user_id, email, password_hash FROM users WHERE email = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "DB Error: Prepare LOGIN failed."]);
        exit();
    }

    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        echo json_encode([
            "success" => true,
            "userId" => $user['user_id'],
            "email" => $user['email'],
            "message" => "Login success"
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Invalid mode."]);
    http_response_code(400);
}