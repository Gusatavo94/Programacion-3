const New = require('../models/New');

class NewRepository {
    async findAll() {
        return await New.find({}).sort({ createdAt: -1 });
    }

    async findById(id) {
        return await New.findById(id);
    }

    async create(newData) {
        return await New.create(newData);
    }

    async update(id, updateData) {
        return await New.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async delete(id) {
        return await New.findByIdAndDelete(id);
    }
}

module.exports = NewRepository;
