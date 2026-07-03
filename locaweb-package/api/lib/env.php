<?php
// api/lib/env.php — carrega o .env da raiz do projeto

function load_env(): void {
    static $loaded = false;
    if ($loaded) return;
    $loaded = true;

    // .env fica dois níveis acima de api/lib/
    $path = dirname(__DIR__, 2) . '/.env';
    if (!is_readable($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        if (!str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v);
        // remove aspas
        if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && $v[strlen($v) - 1] === $v[0]) {
            $v = substr($v, 1, -1);
        }
        $_ENV[$k] = $v;
        putenv("$k=$v");
    }
}

function env(string $key, ?string $default = null): ?string {
    load_env();
    $v = $_ENV[$key] ?? getenv($key);
    return ($v === false || $v === null || $v === '') ? $default : $v;
}
