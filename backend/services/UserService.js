class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getAllUsers() {
        return await this.userRepository.findAll();
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }

    async createUser(userData) {
        const { email, username } = userData;
        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) {
            throw new Error('El correo electrónico ya está registrado');
        }
        const usernameExists = await this.userRepository.findByUsername(username);
        if (usernameExists) {
            throw new Error('El nombre de usuario ya está registrado');
        }
        const user = await this.userRepository.create(userData);
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }

    async updateUser(id, updateData) {
        if (updateData.email) {
            const userWithEmail = await this.userRepository.findByEmail(updateData.email);
            if (userWithEmail && userWithEmail._id.toString() !== id) {
                throw new Error('El correo electrónico ya está registrado por otro usuario');
            }
        }
        if (updateData.username) {
            const userWithUsername = await this.userRepository.findByUsername(updateData.username);
            if (userWithUsername && userWithUsername._id.toString() !== id) {
                throw new Error('El nombre de usuario ya está registrado por otro usuario');
            }
        }

        const user = await this.userRepository.update(id, updateData);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }

    async deleteUser(id) {
        const user = await this.userRepository.delete(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return { message: 'Usuario eliminado exitosamente' };
    }
}

module.exports = UserService;
