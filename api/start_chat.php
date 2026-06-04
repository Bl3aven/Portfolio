<?php
session_set_cookie_params([
  "lifetime" => 0,
  "path"     => "/",
  "secure"   => true,
  "httponly" => true,
  "samesite" => "Strict",
]);
session_start();

header("Content-Type: application/json; charset=utf-8");

// Rate limit: one new chat session per IP per 5 minutes
$ip = $_SERVER["HTTP_CF_CONNECTING_IP"]
   ?? $_SERVER["HTTP_X_FORWARDED_FOR"]
   ?? $_SERVER["REMOTE_ADDR"]
   ?? "";
$ip = trim(explode(",", $ip)[0]);
$rateLimitFile = sys_get_temp_dir() . "/chat_rl_" . hash("sha256", $ip);
$cooldown = 300;
if (is_file($rateLimitFile) && (time() - filemtime($rateLimitFile)) < $cooldown) {
  http_response_code(429);
  echo json_encode(["error" => "Too many requests. Please wait before starting a new chat."], JSON_UNESCAPED_UNICODE);
  exit;
}

$configPath = __DIR__ . "/config.php";
if (!is_file($configPath)) {
  http_response_code(503);
  echo json_encode(["error" => "Chat configuration missing"]);
  exit;
}

require $configPath;

function clean_contact_field($value, $limit = 80) {
  $value = trim((string)$value);
  $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
  $value = preg_replace('/\s+/u', ' ', $value);

  return function_exists("mb_substr")
    ? mb_substr($value, 0, $limit, "UTF-8")
    : substr($value, 0, $limit);
}

function clean_phone($value) {
  $value = clean_contact_field($value, 30);
  return trim(preg_replace('/[^\d+().\s-]/', '', $value));
}

function channel_slug($value) {
  $value = trim((string)$value);
  if (function_exists("iconv")) {
    $converted = iconv("UTF-8", "ASCII//TRANSLIT//IGNORE", $value);
    if ($converted !== false) {
      $value = $converted;
    }
  }

  $value = strtolower($value);
  $value = preg_replace('/[^a-z0-9]+/', '-', $value);
  $value = trim($value, "-");

  return $value !== "" ? $value : "contact";
}

$input = json_decode(file_get_contents("php://input"), true);
if (!is_array($input)) {
  $input = [];
}

$firstName = clean_contact_field($input["firstName"] ?? $input["name"] ?? "", 80);
$lastName = clean_contact_field($input["lastName"] ?? "", 80);
$phone = clean_phone($input["phone"] ?? "");

if ($firstName === "") {
  http_response_code(400);
  echo json_encode(["error" => "First name is required"], JSON_UNESCAPED_UNICODE);
  exit;
}

$visitorDisplay = trim(($firstName ? $firstName . " " : "") . $lastName);
$slug = channel_slug(trim($firstName . " " . $lastName));
$suffix = date("md-His") . "-" . bin2hex(random_bytes(2));
$channelSlug = substr($slug, 0, 70);
$name = "portfolio-" . $channelSlug . "-" . $suffix;

$topicLines = [
  "Contact depuis le portfolio",
  "Prénom: " . $firstName,
  "Nom: " . ($lastName !== "" ? $lastName : "Non renseigné"),
  "Téléphone: " . ($phone !== "" ? $phone : "Non renseigné"),
  "Créé le: " . date("Y-m-d H:i:s")
];

$payload = json_encode([
  "name" => $name,
  "type" => 0,
  "parent_id" => DISCORD_CATEGORY_ID,
  "topic" => implode("\n", $topicLines)
], JSON_UNESCAPED_UNICODE);

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
  session_regenerate_id(true);
  $_SESSION["channel_id"] = $data["id"];
  $_SESSION["visitor_display"] = $visitorDisplay;
  $_SESSION["visitor_last_name"] = $lastName;
  $_SESSION["visitor_first_name"] = $firstName;
  $_SESSION["visitor_phone"] = $phone;

  // Mark rate limit only on success
  touch($rateLimitFile);

  echo json_encode([
    "status" => "ok",
    "channel" => $name
  ], JSON_UNESCAPED_UNICODE);
} else {
  error_log("start_chat.php: Discord API error (status={$status}) ip={$ip}");
  http_response_code(500);
  echo json_encode(["error" => "Service temporarily unavailable"], JSON_UNESCAPED_UNICODE);
}
