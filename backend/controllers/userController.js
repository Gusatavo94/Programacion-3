class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async getAll(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users);
        } 
        catch (err) {
            return res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const user = await this.userService.getUserById(id);
            return res.status(200).json(user);
        } 
        catch (err) {
            if (err.message === 'Usuario no encontrado') {
                return res.status(404).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
        }
    }

    async create(req, res) {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'El email, password y username son obligatorios' });
        }
        try {
            const user = await this.userService.createUser({ email, password, username });
            return res.status(201).json({ message: 'Usuario creado exitosamente', user });
        } 
        catch (err) {
            if (err.message === 'El correo electrónico ya está registrado' || err.message === 'El nombre de usuario ya está registrado') {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { email, password, username } = req.body;

        try {
            const user = await this.userService.updateUser(id, { email, password, username });
            return res.status(200).json({ message: 'Usuario actualizado exitosamente', user });
        } 
        catch (err) {
            if (err.message === 'Usuario no encontrado') {
                return res.status(404).json({ message: err.message });
            }
            if (err.message === 'El correo electrónico ya está registrado por otro usuario' || err.message === 'El nombre de usuario ya está registrado por otro usuario') {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            const result = await this.userService.deleteUser(id);
            return res.status(200).json(result);
        } 
        catch (err) {
            if (err.message === 'Usuario no encontrado') {
                return res.status(404).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
        }
    }
}

module.exports = UserController;
