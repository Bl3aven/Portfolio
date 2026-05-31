<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

$configPath = __DIR__ . "/config.php";
if (!is_file($configPath)) {
  http_response_code(503);
  echo json_encode([]);
  exit;
}

require $configPath;

$channel_id = $_SESSION["channel_id"] ?? null;

if (!$channel_id) {
  http_response_code(400);
  echo json_encode([]);
  exit;
}

// Get last messages
$ch = curl_init();
curl_setopt_array($ch, [
  CURLOPT_URL => DISCORD_API . "/channels/" . $channel_id . "/messages?limit=10",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bot " . DISCORD_BOT_TOKEN
  ],
  CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$messages = json_decode($response, true);
if ($status < 200 || $status >= 300 || !is_array($messages)) {
  http_response_code(502);
  echo json_encode([]);
  exit;
}

// Filter only YOUR messages (not visitor echoes)
$output = [];

foreach (array_reverse($messages) as $msg) {
  if (isset($msg["content"], $msg["author"]["username"]) && strpos($msg["content"], "🌐 VISITEUR") === false) {
    $output[] = [
      "author" => $msg["author"]["username"],
      "content" => $msg["content"]
    ];
  }
}

echo json_encode($output, JSON_UNESCAPED_UNICODE);
