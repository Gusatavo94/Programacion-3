const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const userRepository = new UserRepository();

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await userRepository.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }

            req.user = user;
            return next();
        } 
        catch (err) {
            return res.status(401).json({ message: 'No autorizado, token fallido' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, sin token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'No autorizado como administrador' });
    }
};

module.exports = { protect, admin };
