# Programacion 3

API REST en PHP con MySQL, y un frontend de HTML, CSS y JS plano que la consume. Hacen falta PHP 8.2 con `pdo_mysql` (el de XAMPP alcanza) y Docker. En esta maquina Docker corre dentro de WSL Ubuntu, asi que los comandos de contenedores van por `wsl`.

## Levantarlo

La base, desde la raiz del proyecto:

```bash
wls
cd ubicacion/del/repo o en mi caso "cd /mnt/c/Users/adetg/Desktop/Programacion-3"
docker compose up -d
```

Y el servidor:

```bash
php -S localhost:3000 -t frontend router.php
```

Queda en http://localhost:3000, con la API en `/api`. El servidor embebido de PHP no reescribe URLs, por lo que `router.php` manda los paths `/api/` al backend y el resto lo sirve como estatico desde `frontend/`. De esta manera todo vive en el mismo origen y el front puede llamar `fetch('/api/posts')` sin CORS.

Para verificar que PHP llega a la base:

```bash
curl http://localhost:3000/api/posts
```

Un `[]` es la respuesta correcta, la lista vacia de posts. Si sale un `PDOException` el problema esta en MySQL, no en PHP: tarda unos segundos en aceptar conexiones aunque el contenedor ya figure como `Up`, asi que conviene reintentar antes de buscar la falla en otro lado.

Para apagar, `docker compose -p progra3 stop` (los datos quedan en el volumen).
