<?php

class BaseController {
    protected function jsonResponse(mixed $data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode($data);
        exit;
    }

    // req.body
    protected function getJsonBody(): array {
        $raw = file_get_contents("php://input");
        return json_decode($raw, true) ?? [];
    }
}
