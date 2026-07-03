<?php
// Cria ou atualiza. Se body.id existe -> update; senão insert.
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';

cors_headers();
require_method('POST');
require_admin();

$in = json_input();

$id           = trim((string)($in['id'] ?? ''));
$brand        = trim((string)($in['brand'] ?? ''));
$model        = trim((string)($in['model'] ?? ''));
$year         = (int)($in['year'] ?? 0);
$mileage      = (int)($in['mileage'] ?? 0);
$price        = (float)($in['price'] ?? 0);
$color        = $in['color']        ?? null;
$fuel         = $in['fuel']         ?? null;
$transmission = $in['transmission'] ?? null;
$category     = in_array(($in['category'] ?? 'carro'), ['carro','moto'], true) ? $in['category'] : 'carro';
$status       = in_array(($in['status']   ?? 'disponivel'), ['disponivel','reservado','vendido'], true) ? $in['status'] : 'disponivel';
$featured     = !empty($in['featured']) ? 1 : 0;
$description  = $in['description'] ?? null;
$images       = is_array($in['images'] ?? null) ? array_values($in['images']) : [];

if (!$brand || !$model || $year < 1900 || $price <= 0) {
    json_response(['error' => 'Campos obrigatórios ausentes ou inválidos'], 400);
}

$imagesJson = json_encode($images, JSON_UNESCAPED_UNICODE);

if ($id) {
    $stmt = db()->prepare('UPDATE vehicles SET brand=?, model=?, year=?, mileage=?, price=?, color=?, fuel=?, transmission=?, category=?, status=?, featured=?, description=?, images=? WHERE id=?');
    $stmt->execute([$brand, $model, $year, $mileage, $price, $color, $fuel, $transmission, $category, $status, $featured, $description, $imagesJson, $id]);
    if ($stmt->rowCount() === 0) {
        // Pode ser que nada mudou; verifica se existe.
        $chk = db()->prepare('SELECT id FROM vehicles WHERE id=?');
        $chk->execute([$id]);
        if (!$chk->fetch()) json_response(['error' => 'not_found'], 404);
    }
    json_response(['ok' => true, 'id' => $id]);
} else {
    $id = uuid_v4();
    $stmt = db()->prepare('INSERT INTO vehicles (id, brand, model, year, mileage, price, color, fuel, transmission, category, status, featured, description, images) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    $stmt->execute([$id, $brand, $model, $year, $mileage, $price, $color, $fuel, $transmission, $category, $status, $featured, $description, $imagesJson]);
    json_response(['ok' => true, 'id' => $id]);
}
