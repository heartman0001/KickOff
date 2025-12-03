<?php
// kickoff-api/db.php

$host = 'localhost';
$db   = 'kickoff_db'; // <<< ตรวจสอบชื่อฐานข้อมูล
$user = 'root';       // <<< ตรวจสอบ username
$pass = '';           // <<< ตรวจสอบ password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    // กำหนดให้ PDO โยน Exception เมื่อมี Error ใน SQL (ช่วยในการ Debug)
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    // กำหนดรูปแบบการดึงข้อมูลเป็นแบบ Associative Array
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     // แสดงข้อความ Error หากเชื่อมต่อ DB ไม่ได้
     echo json_encode(["success" => false, "message" => "Database connection error: " . $e->getMessage()]);
     exit();
}
?>