<?php
session_start();

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["channel_id"])) {
  http_response_code(403);
  echo json_encode(["error" => "No active chat"]);
  exit;
}

$configPath = __DIR__ . "/config.php";
if (!is_file($configPath)) {
  http_response_code(503);
  echo json_encode(["error" => "Chat configuration missing"]);
  exit;
}

require $configPath;

$input = json_decode(file_get_contents("php://input"), true);
$message = trim((string)($input["message"] ?? ""));
$message = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $message);
$message = function_exists("mb_substr")
  ? mb_substr($message, 0, 1000, "UTF-8")
  : substr($message, 0, 1000);

if ($message === "") {
  http_response_code(400);
  echo json_encode(["error" => "Empty message"]);
  exit;
}

$channel_id = $_SESSION["channel_id"] ?? null;

if (!$channel_id) {
  http_response_code(400);
  echo json_encode(["error" => "No channel"]);
  exit;
}

$payload = json_encode([
  "content" => "🌐 VISITEUR : " . $message
]);

$ch = curl_init();
curl_setopt_array($ch, [
  CURLOPT_URL => DISCORD_API . "/channels/" . $channel_id . "/messages",
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bot " . DISCORD_BOT_TOKEN,
    "Content-Type: application/json"
  ],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POSTFIELDS => $payload
]);

curl_exec($ch);
$curlError = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status >= 200 && $status < 300) {
  echo json_encode(["status" => "sent"], JSON_UNESCAPED_UNICODE);
} else {
  http_response_code(502);
  echo json_encode(["error" => "Discord send failed", "details" => $curlError], JSON_UNESCAPED_UNICODE);
}
