<?php
// Cria novo admin (rota protegida — só admin logado).
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';

cors_headers();
require_method('POST');
require_admin();

$in = json_input();
$email = trim(strtolower($in['email'] ?? ''));
$pass  = (string)($in['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_response(['error' => 'E-mail inválido'], 400);
if (strlen($pass) < 8) json_response(['error' => 'Senha deve ter no mínimo 8 caracteres'], 400);

$id = uuid_v4();
$hash = password_hash($pass, PASSWORD_BCRYPT);
$stmt = db()->prepare('INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, "admin")');
try {
    $stmt->execute([$id, $email, $hash]);
} catch (PDOException $e) {
    json_response(['error' => 'E-mail já cadastrado'], 409);
}
json_response(['ok' => true, 'id' => $id]);
