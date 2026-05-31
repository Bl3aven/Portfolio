<?php
header("Content-Type: application/json; charset=utf-8");

$configPath = __DIR__ . "/config.php";
if (!is_file($configPath)) {
  http_response_code(503);
  echo json_encode(["error" => "Configuration missing"], JSON_UNESCAPED_UNICODE);
  exit;
}

require $configPath;

/*
  Discord Interaction Endpoint
  Compatible with validation + buttons
*/

$publicKey = hex2bin(DISCORD_PUBLIC_KEY);
if ($publicKey === false || !function_exists("sodium_crypto_sign_verify_detached")) {
  http_response_code(500);
  echo json_encode(["error" => "Signature verification unavailable"], JSON_UNESCAPED_UNICODE);
  exit;
}

$signature = $_SERVER["HTTP_X_SIGNATURE_ED25519"] ?? "";
$timestamp = $_SERVER["HTTP_X_SIGNATURE_TIMESTAMP"] ?? "";

$body = file_get_contents("php://input");

/* ===== Verify request signature ===== */
if (!$signature || !$timestamp) {
  http_response_code(401);
  echo "Missing signature";
  exit;
}

$verified = sodium_crypto_sign_verify_detached(
  hex2bin($signature),
  $timestamp . $body,
  $publicKey
);

if (!$verified) {
  http_response_code(401);
  echo "Bad signature";
  exit;
}

/* ===== Parse payload ===== */
$data = json_decode($body, true);

/* ===== Discord PING ===== */
if ($data["type"] === 1) {
  echo json_encode(["type" => 1], JSON_UNESCAPED_UNICODE);
  exit;
}

/* ===== Button Interaction ===== */
if ($data["type"] === 3 && $data["data"]["custom_id"] === "delete_leads") {
  deleteCategoryChannels();

  echo json_encode([
    "type" => 4,
    "data" => [
      "content" => "🧹 Tous les salons Portfolio Leads ont été supprimés.",
      "flags" => 64
    ]
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

/* ===== FUNCTIONS ===== */
function deleteCategoryChannels() {
  require_once __DIR__ . "/config.php";

  $ch = curl_init();
  curl_setopt_array($ch, [
    CURLOPT_URL => DISCORD_API . "/guilds/" . DISCORD_GUILD_ID . "/channels",
    CURLOPT_HTTPHEADER => [
      "Authorization: Bot " . DISCORD_BOT_TOKEN
    ],
    CURLOPT_RETURNTRANSFER => true
  ]);

  $res = curl_exec($ch);
  curl_close($ch);

  $channels = json_decode($res, true);

  foreach ($channels as $channel) {
    if (
        ($channel["parent_id"] ?? "") === DISCORD_CATEGORY_ID &&
        $channel["name"] !== ADMIN_CHANNEL_NAME
    ) {
      $del = curl_init();
      curl_setopt_array($del, [
        CURLOPT_URL => DISCORD_API . "/channels/" . $channel["id"],
        CURLOPT_CUSTOMREQUEST => "DELETE",
        CURLOPT_HTTPHEADER => [
          "Authorization: Bot " . DISCORD_BOT_TOKEN
        ],
        CURLOPT_RETURNTRANSFER => true
      ]);
      curl_exec($del);
      curl_close($del);
    }
  }
}
