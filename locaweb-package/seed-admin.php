<?php
// Uso: php seed-admin.php email@exemplo.com senhaForte
// Imprime um INSERT pronto para colar no phpMyAdmin.

if ($argc < 3) {
    fwrite(STDERR, "Uso: php seed-admin.php <email> <senha>\n");
    exit(1);
}

$email = trim($argv[1]);
$pass  = $argv[2];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "E-mail inválido.\n");
    exit(1);
}
if (strlen($pass) < 8) {
    fwrite(STDERR, "Senha deve ter no mínimo 8 caracteres.\n");
    exit(1);
}

$id   = sprintf('%08x-%04x-%04x-%04x-%012x',
    mt_rand(0, 0xffffffff), mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffffffffffff)
);
$hash = password_hash($pass, PASSWORD_BCRYPT);

$emailEsc = str_replace("'", "''", $email);
$hashEsc  = str_replace("'", "''", $hash);

echo "-- Cole este SQL no phpMyAdmin (banco -> aba SQL):\n\n";
echo "INSERT INTO `users` (`id`, `email`, `password_hash`, `role`) VALUES\n";
echo "  ('$id', '$emailEsc', '$hashEsc', 'admin');\n";
