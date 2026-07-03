<?php
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';

cors_headers();
require_method('GET');

$row = db()->query("SELECT COUNT(*) AS c FROM users WHERE role = 'admin'")->fetch();
json_response(['exists' => (int)$row['c'] > 0]);
