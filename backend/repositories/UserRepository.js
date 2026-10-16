const User = require('../models/User');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findByUsername(username) {
        return await User.findOne({ username });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findAll() {
        return await User.find({}, '-password');
    }

    async update(id, updateData) {
        const user = await User.findById(id);
        if (!user) return null;

        if (updateData.email) user.email = updateData.email;
        if (updateData.username) user.username = updateData.username;
        if (updateData.password) user.password = updateData.password;

        await user.save();
        return user;
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = UserRepository;
