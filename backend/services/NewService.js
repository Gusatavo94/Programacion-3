class NewService {
    constructor(newRepository) {
        this.newRepository = newRepository;
    }

    async getAllNews() {
        return await this.newRepository.findAll();
    }

    async getNewById(id) {
        const newsItem = await this.newRepository.findById(id);
        if (!newsItem) {
            throw new Error('Noticia no encontrada');
        }
        return newsItem;
    }

    async createNew(newData) {
        return await this.newRepository.create(newData);
    }

    async updateNew(id, updateData) {
        const newsItem = await this.newRepository.update(id, updateData);
        if (!newsItem) {
            throw new Error('Noticia no encontrada');
        }
        return newsItem;
    }

    async deleteNew(id) {
        const newsItem = await this.newRepository.delete(id);
        if (!newsItem) {
            throw new Error('Noticia no encontrada');
        }
        return { message: 'Noticia eliminada exitosamente' };
    }
}

module.exports = NewService;
