class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async register(req, res) {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        try {
            const result = await this.authService.register(email, password, username);
            return res.status(201).json({
                message: 'Usuario registrado exitosamente',
                ...result
            });
        } 
        catch (err) {
            if (err.message === 'El correo electrónico ya está registrado' || err.message === 'El nombre de usuario ya está registrado') {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({
                message: 'Error en el servidor al registrar el usuario',
                error: err.message
            });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        try {
            const result = await this.authService.login(email, password);
            return res.status(200).json({
                message: 'Inicio de sesión exitoso',
                ...result
            });
        } 
        catch (err) {
            if (err.message === 'Credenciales inválidas') {
                return res.status(401).json({ message: err.message });
            }
            return res.status(500).json({
                message: 'Error en el servidor al iniciar sesión',
                error: err.message
            });
        }
    }
}

module.exports = AuthController;
