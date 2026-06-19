/**
 * Controlador de empresas (companies).
 *
 * Responsável por:
 * - CRUD completo de empresas com soft delete e restauro.
 * - Validação de NIF único na criação.
 * - Delegação de toda a lógica de negócio ao companiesService (incluindo auditoria).
 *
 * Fluxo:
 * Frontend -> Rota Express (com auth middleware) -> Controller -> companiesService -> Base de Dados -> Resposta JSON.
 */
const companyService = require('../services/companiesService');

const companyController = {
    // Cria uma nova empresa. O serviço trata da persistência e registo de auditoria.
    async create(req, res) {
        try {
            const newCompany = await companyService.create(req.body, req.user, req.ip);
            return res.status(201).json({ 
                message: 'Company created successfully!', 
                company: newCompany 
            });
        } catch (error) {
            // NIF duplicado — restrição de unicidade na base de dados.
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'A company with this NIF is already registered.' });
            }
            console.error('Create Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Lista todas as empresas registadas (acessível ao admin).
    async findAll(req, res) {
        try {
            const companies = await companyService.findAll();
            return res.status(200).json(companies);
        } catch (error) {
            console.error('Find All Companies error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Devolve uma empresa específica por ID.
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

    // Atualiza os dados de uma empresa existente.
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

    // Apaga logicamente uma empresa (soft delete). A auditoria é tratada no serviço.
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

    // Restaura uma empresa previamente eliminada (reverte soft delete).
    async restore(req, res) {
        try {
            const company = await companyService.restore(req.params.id, req.user, req.ip);
            return res.status(200).json({ message: 'Company restored successfully!', company });
        } catch (error) {
            if (error.message === 'Company not found.') {
                return res.status(404).json({ error: error.message });
            }
            // A empresa já se encontra ativa — o serviço lança este erro.
            if (error.message === 'This company is already active.') {
                return res.status(400).json({ error: error.message });
            }
            console.error('Restore Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = companyController;