<?php
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';

cors_headers();
require_method('GET');

$sql = 'SELECT id, brand, model, year, mileage, price, color, fuel, transmission, category, status, featured, description, images, created_at, updated_at
        FROM vehicles ORDER BY featured DESC, created_at DESC';
$rows = db()->query($sql)->fetchAll();

foreach ($rows as &$r) {
    $r['price']    = (float)$r['price'];
    $r['year']     = (int)$r['year'];
    $r['mileage']  = (int)$r['mileage'];
    $r['featured'] = (bool)(int)$r['featured'];
    $r['images']   = json_decode($r['images'] ?? '[]', true) ?: [];
}
json_response($rows);
