<?php
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/auth.php';

cors_headers();
require_method('GET');

$u = current_user();
if (!$u) json_response(['user' => null], 200);
json_response(['user' => ['id' => $u['id'], 'email' => $u['email'], 'role' => $u['role']]]);
