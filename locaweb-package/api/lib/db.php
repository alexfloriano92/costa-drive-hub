<?php
require_once __DIR__ . '/env.php';

function db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $host = env('DB_HOST');
    $name = env('DB_NAME');
    $user = env('DB_USER');
    $pass = env('DB_PASS');

    if (!$host || !$name || !$user) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Banco não configurado. Verifique o .env']);
        exit;
    }

    $dsn = "mysql:host=$host;dbname=$name;charset=utf8mb4";
    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Falha ao conectar no banco']);
        exit;
    }
    return $pdo;
}
