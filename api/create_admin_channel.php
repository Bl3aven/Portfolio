<?php
if (PHP_SAPI !== "cli") {
  http_response_code(403);
  exit("Run this setup script from CLI.");
}

$configPath = __DIR__ . "/config.php";
if (!is_file($configPath)) {
  exit("Missing api/config.php. Copy config.example.php first.\n");
}

require $configPath;

// ========== CREATE ADMIN CHANNEL IN CATEGORY ==========
$payload = json_encode([
  "name" => ADMIN_CHANNEL_NAME,
  "type" => 0,
  "parent_id" => DISCORD_CATEGORY_ID
]);

$ch = curl_init();
curl_setopt_array($ch, [
  CURLOPT_URL => DISCORD_API . "/guilds/" . DISCORD_GUILD_ID . "/channels",
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bot " . DISCORD_BOT_TOKEN,
    "Content-Type: application/json"
  ],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POSTFIELDS => $payload
]);

$res = curl_exec($ch);
curl_close($ch);

$data = json_decode($res, true);

if (!isset($data["id"])) {
  die("❌ Failed to create admin channel:\n" . print_r($data, true));
}

$channel_id = $data["id"];
echo "✅ Admin channel created in category\n";

// ========== SEND BUTTON MESSAGE ==========
$message = [
  "content" => "⚠️ **ZONE ADMIN PORTFOLIO**\n\nClique sur le bouton ci-dessous pour supprimer **TOUS les salons de leads** dans cette catégorie.\n\n🚨 Cette action est irréversible.",
  "components" => [[
    "type" => 1,
    "components" => [[
      "type" => 2,
      "style" => 4,
      "label" => "🗑️ Supprimer toutes les conversations",
      "custom_id" => "delete_leads"
    ]]
  ]]
];

$ch = curl_init();
curl_setopt_array($ch, [
  CURLOPT_URL => DISCORD_API . "/channels/$channel_id/messages",
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bot " . DISCORD_BOT_TOKEN,
    "Content-Type: application/json"
  ],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POSTFIELDS => json_encode($message)
]);

$res = curl_exec($ch);
curl_close($ch);

$response = json_decode($res, true);

if (isset($response["id"])) {
  echo "✅ Button message sent\n";
} else {
  echo "⚠️ Failed to send button message:\n";
  print_r($response);
}
