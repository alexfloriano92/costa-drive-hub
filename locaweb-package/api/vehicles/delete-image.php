<?php
// Deleta uma imagem específica do disco (admin only)
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/auth.php';

cors_headers();
require_method('POST');
require_admin();

$in = json_input();
$path = (string)($in['path'] ?? '');
if (!$path) json_response(['error' => 'path obrigatório'], 400);

$upDir = rtrim(env('UPLOAD_DIR', ''), '/');
$file  = $upDir . '/' . basename($path);
if ($upDir && is_file($file)) @unlink($file);
json_response(['ok' => true]);
