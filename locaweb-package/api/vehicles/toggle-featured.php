<?php
// Toggle featured (admin only)
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';

cors_headers();
require_method('POST');
require_admin();

$in = json_input();
$id = trim((string)($in['id'] ?? ''));
$featured = !empty($in['featured']) ? 1 : 0;
if (!$id) json_response(['error' => 'id obrigatório'], 400);

$stmt = db()->prepare('UPDATE vehicles SET featured = ? WHERE id = ?');
$stmt->execute([$featured, $id]);
json_response(['ok' => true]);
