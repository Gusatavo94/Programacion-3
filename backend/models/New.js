const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        maxlength: [60, 'El título no puede superar los 60 caracteres'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
        trim: true
    },
    autor: {
        type: String,
        required: [true, 'El autor es obligatorio'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: {
            values: ['Novedad', 'Tecnologia', 'Programas'],
            message: 'Categoría no válida. Debe ser Novedad, Tecnologia o Programas'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('New', newSchema);
