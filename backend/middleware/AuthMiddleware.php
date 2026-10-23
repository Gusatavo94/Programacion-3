<?php

class AuthMiddleware {

    public function isAdmin(): void {
        $headers = getallheaders();
        $token = $headers["Authorization"] ?? "";

        //sin tkn en cabecera frenamos
        if (empty($token)) {
            http_response_code(401);
            echo json_encode(["message" => "No autorizado, se requiere token"]);
            exit;
        }
    }
}
