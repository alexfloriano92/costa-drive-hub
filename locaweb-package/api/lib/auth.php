<?php
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/db.php';

function b64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function b64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_sign(array $payload): string {
    $secret = env('JWT_SECRET');
    if (!$secret || strlen($secret) < 16) {
        http_response_code(500);
        echo json_encode(['error' => 'JWT_SECRET inválido']);
        exit;
    }
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $h = b64url_encode(json_encode($header));
    $p = b64url_encode(json_encode($payload));
    $sig = hash_hmac('sha256', "$h.$p", $secret, true);
    return "$h.$p." . b64url_encode($sig);
}

function jwt_verify(string $token): ?array {
    $secret = env('JWT_SECRET');
    if (!$secret) return null;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $s] = $parts;
    $expected = b64url_encode(hash_hmac('sha256', "$h.$p", $secret, true));
    if (!hash_equals($expected, $s)) return null;
    $payload = json_decode(b64url_decode($p), true);
    if (!is_array($payload)) return null;
    if (isset($payload['exp']) && $payload['exp'] < time()) return null;
    return $payload;
}

function current_user(): ?array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$auth && function_exists('apache_request_headers')) {
        $h = apache_request_headers();
        $auth = $h['Authorization'] ?? $h['authorization'] ?? '';
    }
    if (!$auth || stripos($auth, 'Bearer ') !== 0) return null;
    $token = trim(substr($auth, 7));
    $payload = jwt_verify($token);
    if (!$payload || empty($payload['sub'])) return null;

    $stmt = db()->prepare('SELECT id, email, role FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$payload['sub']]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function require_admin(): array {
    $u = current_user();
    if (!$u || $u['role'] !== 'admin') {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Não autorizado']);
        exit;
    }
    return $u;
}

function uuid_v4(): string {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}
