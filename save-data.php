<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate that we received valid JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Validate required structure
if (!isset($data['stats']) || !isset($data['teamMembers'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required data structure']);
    exit;
}

// Try to save the data to data.json
$jsonString = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

if (file_put_contents('data.json', $jsonString) !== false) {
    echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write to data.json file']);
}
?>