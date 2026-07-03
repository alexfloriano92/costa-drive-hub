<?php
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';

cors_headers();
require_method('GET');

$id = trim($_GET['id'] ?? '');
if (!$id) json_response(['error' => 'id obrigatório'], 400);

$stmt = db()->prepare('SELECT * FROM vehicles WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$r = $stmt->fetch();
if (!$r) json_response(['error' => 'not_found'], 404);

$r['price']    = (float)$r['price'];
$r['year']     = (int)$r['year'];
$r['mileage']  = (int)$r['mileage'];
$r['featured'] = (bool)(int)$r['featured'];
$r['images']   = json_decode($r['images'] ?? '[]', true) ?: [];
json_response($r);
