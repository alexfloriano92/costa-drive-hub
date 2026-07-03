<?php
// Upload de imagem. Retorna { path: "/uploads/vehicles/xxx.jpg" }
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/auth.php';

cors_headers();
require_method('POST');
require_admin();

if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    json_response(['error' => 'Nenhum arquivo enviado'], 400);
}

$max = 8 * 1024 * 1024; // 8 MB
if ($_FILES['file']['size'] > $max) {
    json_response(['error' => 'Arquivo maior que 8 MB'], 413);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($_FILES['file']['tmp_name']);
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];
if (!isset($allowed[$mime])) json_response(['error' => 'Formato inválido (use jpg, png ou webp)'], 415);
$ext = $allowed[$mime];

$upDir = rtrim(env('UPLOAD_DIR', ''), '/');
$upUrl = rtrim(env('UPLOAD_URL', '/uploads/vehicles'), '/');
if (!$upDir) json_response(['error' => 'UPLOAD_DIR não configurado'], 500);
if (!is_dir($upDir)) @mkdir($upDir, 0755, true);
if (!is_writable($upDir)) json_response(['error' => 'Pasta de upload sem permissão de escrita'], 500);

$filename = bin2hex(random_bytes(10)) . '.' . $ext;
$dest = "$upDir/$filename";
if (!move_uploaded_file($_FILES['file']['tmp_name'], $dest)) {
    json_response(['error' => 'Falha ao salvar arquivo'], 500);
}
@chmod($dest, 0644);

json_response(['path' => "$upUrl/$filename"]);
