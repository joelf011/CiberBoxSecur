const companyService = require('../services/companiesService');

const companyController = {
    // CREATE
    async create(req, res) {
        try {
            const newCompany = await companyService.create(req.body, req.user, req.ip);
            return res.status(201).json({ 
                message: 'Company created successfully!', 
                company: newCompany 
            });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'A company with this NIF is already registered.' });
            }
            console.error('Create Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ALL
    async findAll(req, res) {
        try {
            const companies = await companyService.findAll();
            return res.status(200).json(companies);
        } catch (error) {
            console.error('Find All Companies error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ONE
    async findOne(req, res) {
        try {
            const company = await companyService.findOne(req.params.id);
            return res.status(200).json(company);
        } catch (error) {
            if (error.message === 'Company not found.') {
                return res.status(404).json({ error: error.message });
            }
            console.error('Find One Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const company = await companyService.update(req.params.id, req.body, req.user, req.ip);
            return res.status(200).json({ message: 'Company updated successfully!', company });
        } catch (error) {
            if (error.message === 'Company not found.') {
                return res.status(404).json({ error: error.message });
            }
            console.error('Update Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            await companyService.delete(req.params.id, req.user, req.ip);
            return res.status(200).json({ message: 'Company deleted successfully!' });
        } catch (error) {
            if (error.message === 'Company not found.') {
                return res.status(404).json({ error: error.message });
            }
            console.error('Delete Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // RESTORE
    async restore(req, res) {
        try {
            const company = await companyService.restore(req.params.id, req.user, req.ip);
            return res.status(200).json({ message: 'Company restored successfully!', company });
        } catch (error) {
            if (error.message === 'Company not found.') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'This company is already active.') {
                return res.status(400).json({ error: error.message });
            }
            console.error('Restore Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = companyController;