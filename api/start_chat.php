<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

$configPath = __DIR__ . "/config.php";
if (!is_file($configPath)) {
  http_response_code(503);
  echo json_encode(["error" => "Chat configuration missing"]);
  exit;
}

require $configPath;

$name = "lead-" . date("Ymd-His") . "-" . bin2hex(random_bytes(3));

$payload = json_encode([
  "name" => $name,
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

$response = curl_exec($ch);
$curlError = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if ($status >= 200 && $status < 300 && isset($data["id"])) {
  $_SESSION["channel_id"] = $data["id"];
  echo json_encode(["status" => "ok"], JSON_UNESCAPED_UNICODE);
} else {
  http_response_code(500);
  echo json_encode([
    "error" => "Failed to create channel",
    "details" => $curlError ?: ($data["message"] ?? "Discord API error")
  ], JSON_UNESCAPED_UNICODE);
}
