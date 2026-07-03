<?php
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';

cors_headers();
require_method('POST');

$in = json_input();
$email = trim(strtolower($in['email'] ?? ''));
$pass  = (string)($in['password'] ?? '');

if (!$email || !$pass) json_response(['error' => 'Email e senha obrigatórios'], 400);

$stmt = db()->prepare('SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($pass, $user['password_hash'])) {
    json_response(['error' => 'Credenciais inválidas'], 401);
}

$ttl = (int)(env('JWT_TTL', '604800'));
$token = jwt_sign([
    'sub'   => $user['id'],
    'email' => $user['email'],
    'role'  => $user['role'],
    'iat'   => time(),
    'exp'   => time() + $ttl,
]);

json_response([
    'token' => $token,
    'user'  => ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']],
]);
