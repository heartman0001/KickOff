<?php
// kickoff-api/auth.php
// <<< ต้องไม่มีช่องว่างหรืออักขระใดๆ ก่อนบรรทัดนี้! >>>

// 1. PHP Configuration for debugging (ช่วยในการหาข้อผิดพลาดอื่นๆ หากมี)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 2. CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// 3. จัดการ Preflight CORS Request (สำคัญมาก)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); // ต้องหยุดการประมวลผลโค้ดอื่น ๆ ทันที
}

// 4. กำหนด Content-Type และเรียก DB
header("Content-Type: application/json"); 
require 'db.php'; // ตรวจสอบว่า db.php อยู่ในตำแหน่งที่เข้าถึงได้

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['mode']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid request parameters. Missing mode, email, or password."]);
    http_response_code(400); exit();
}

$mode = $data['mode'];
$email = $data['email'];
$password = $data['password'];

if ($mode === 'signup') {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Email already registered."]);
        exit();
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $userId = uniqid('user_'); // Generate unique user_id
    
    // ดึงข้อมูลเพิ่มเติมจาก Frontend (Auth.tsx)
    $name = $data['name'] ?? null;
    $age = $data['age'] ?? null;
    $height = $data['height'] ?? null;
    $weight = $data['weight'] ?? null;
    $default_avatar = 'https://picsum.photos/seed/default/100/100'; // ต้องแน่ใจว่าคอลัมน์นี้มีใน DB
    
    // SQL INSERT - ตรวจสอบชื่อคอลัมน์อีกครั้ง
    $sql = "INSERT INTO users (user_id, email, password_hash, name, avatar, age, height, weight) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);

    // ตรวจสอบความสำเร็จของการ Execute และส่งข้อมูลกลับ
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
        echo json_encode(["success" => false, "message" => "Database error during registration. (Check SQL Query or column names)"]);
    }

} elseif ($mode === 'login') {
    // SQL SELECT - ตรวจสอบชื่อคอลัมน์
    $stmt = $pdo->prepare("SELECT user_id, email, password_hash FROM users WHERE email = ?");
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
    echo json_encode(["success" => false, "message" => "Invalid action or request."]);
    http_response_code(400);
}
?>