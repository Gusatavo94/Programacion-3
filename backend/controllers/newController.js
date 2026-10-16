class NewController {
    constructor(newService) {
        this.newService = newService;
    }

    async getAll(req, res) {
        try {
            const news = await this.newService.getAllNews();
            return res.status(200).json(news);
        } 
        catch (err) {
            return res.status(500).json({ message: 'Error al obtener las noticias', error: err.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const newsItem = await this.newService.getNewById(id);
            return res.status(200).json(newsItem);
        } 
        catch (err) {
            if (err.message === 'Noticia no encontrada') {
                return res.status(404).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error al obtener la noticia', error: err.message });
        }
    }

    async create(req, res) {
        const { titulo, descripcion, img, autor, categoria } = req.body;
        if (!titulo || !descripcion || !img || !autor || !categoria) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        try {
            const newsItem = await this.newService.createNew({ titulo, descripcion, img, autor, categoria });
            return res.status(201).json({ message: 'Noticia creada exitosamente', newsItem });
        } 
        catch (err) {
            return res.status(500).json({ message: 'Error al crear la noticia', error: err.message });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { titulo, descripcion, img, autor, categoria } = req.body;

        try {
            const newsItem = await this.newService.updateNew(id, { titulo, descripcion, img, autor, categoria });
            return res.status(200).json({ message: 'Noticia actualizada exitosamente', newsItem });
        } 
        catch (err) {
            if (err.message === 'Noticia no encontrada') {
                return res.status(404).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error al actualizar la noticia', error: err.message });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            const result = await this.newService.deleteNew(id);
            return res.status(200).json(result);
        } 
        catch (err) {
            if (err.message === 'Noticia no encontrada') {
                return res.status(404).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Error al eliminar la noticia', error: err.message });
        }
    }
}

module.exports = NewController;
