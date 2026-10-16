const jwt = require('jsonwebtoken');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
    }

    async register(email, password, username) {
        const userExists = await this.userRepository.findByEmail(email);
        if (userExists) {
            throw new Error('El correo electrónico ya está registrado');
        }

        const usernameExists = await this.userRepository.findByUsername(username);
        if (usernameExists) {
            throw new Error('El nombre de usuario ya está registrado');
        }

        const user = await this.userRepository.create({ email, password, username });
        const token = this.generateToken(user._id);

        return {
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token
        };
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Credenciales inválidas');
        }

        const token = this.generateToken(user._id);

        return {
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token
        };
    }
}

module.exports = AuthService;
