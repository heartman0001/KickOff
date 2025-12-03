<?php
// kickoff-api/profile.php

// <<< ต้องไม่มีช่องว่างหรืออักขระใดๆ ก่อนบรรทัดนี้! >>>

// 1. PHP Configuration for debugging (ช่วยในการหาข้อผิดพลาดอื่นๆ หากมี)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 2. CORS Headers (Unified Block)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// 3. จัดการ Preflight CORS Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); 
}

// 4. กำหนด Content-Type และเรียก DB
header("Content-Type: application/json"); 
require 'db.php'; // เรียกใช้การเชื่อมต่อฐานข้อมูล

// Helper function to fetch and format user data
function get_user_data($pdo, $userId) {
    // SQL SELECT: ตรวจสอบชื่อคอลัมน์ใน DB ว่าตรงกับ types.ts (age, height, weight)
    $stmt = $pdo->prepare("SELECT user_id AS id, email, name, avatar, age, height, weight FROM users WHERE user_id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Action: Get Profile
    $userId = $_GET['userId'] ?? null;
    
    if (!$userId) { http_response_code(400); echo json_encode(["success" => false, "message" => "Missing user ID."]); exit(); }
    
    $userData = get_user_data($pdo, $userId);

    if ($userData) {
        echo json_encode(["success" => true, "data" => $userData]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found."]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Action: Update Profile
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['userId'] ?? null;
    
    if (!$userId) { http_response_code(400); echo json_encode(["success" => false, "message" => "Missing user ID."]); exit(); }
    
    // เตรียมข้อมูลสำหรับอัปเดต
    $name = $data['name'] ?? null;
    $avatar = $data['avatar'] ?? 'https://picsum.photos/seed/default/100/100';
    $age = $data['age'] ?? null;
    $height = $data['height'] ?? null;
    $weight = $data['weight'] ?? null;

    // SQL UPDATE: ตรวจสอบชื่อคอลัมน์อีกครั้ง
    $sql = "UPDATE users SET name=?, avatar=?, age=?, height=?, weight=? WHERE user_id=?";
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([$name, $avatar, $age, $height, $weight, $userId]);

    if ($success) {
        // ดึงข้อมูลใหม่ที่อัปเดตแล้วส่งกลับไป
        $updatedData = get_user_data($pdo, $userId);
        echo json_encode(["success" => true, "data" => $updatedData, "message" => "Profile updated."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to update profile. (Check SQL Query or column names)"]);
    }
}
?>