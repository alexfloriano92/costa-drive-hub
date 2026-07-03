<?php
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';

cors_headers();
require_method('POST');
require_admin();

$in = json_input();
$id = trim((string)($in['id'] ?? ''));
if (!$id) json_response(['error' => 'id obrigatório'], 400);

// pega imagens para apagar do disco
$stmt = db()->prepare('SELECT images FROM vehicles WHERE id = ?');
$stmt->execute([$id]);
$row = $stmt->fetch();
if (!$row) json_response(['error' => 'not_found'], 404);

$images = json_decode($row['images'] ?? '[]', true) ?: [];
$upDir  = rtrim(env('UPLOAD_DIR', ''), '/');
foreach ($images as $rel) {
    $file = $upDir . '/' . basename((string)$rel);
    if ($upDir && is_file($file)) @unlink($file);
}

db()->prepare('DELETE FROM vehicles WHERE id = ?')->execute([$id]);
json_response(['ok' => true]);
