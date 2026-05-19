const { Company } = require('../models');
const auditLogController = require('./auditLogController');

const companyController = {
    // CREATE
    async create(req, res) {
        try {
            const { name, nif, manager_user_id, phone, address, compliance_status } = req.body;

            const newCompany = await Company.create({
                name,
                nif,
                manager_user_id: manager_user_id || null,
                phone: phone || null,
                address: address || null,
                compliance_status: compliance_status || 'Awaiting',
                is_active: true
            });

            // LOG: Company created
            await auditLogController.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'COMPANY_CREATE',
                entity_type: 'Company',
                entity_id: newCompany.id,
                ip_address: req.ip
            });

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
            const companies = await Company.findAll({
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(companies);
        } catch (error) {
            console.error('Find All Companies error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ONE
    async findOne(req, res) {
        try {
            const { id } = req.params;
            
            const company = await Company.findByPk(id);
            
            if (!company) {
                return res.status(404).json({ error: 'Company not found.' });
            }

            return res.status(200).json(company);
        } catch (error) {
            console.error('Find One Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const company = await Company.findByPk(id);
            
            if (!company) {
                return res.status(404).json({ error: 'Company not found.' });
            }

            await company.update(updates);

            // LOG: company updated
            await auditLogController.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'COMPANY_UPDATE',
                entity_type: 'Company',
                entity_id: company.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Company updated successfully!', company });
        } catch (error) {
            console.error('Update Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;

            const company = await Company.findByPk(id);
            
            if (!company) {
                return res.status(404).json({ error: 'Company not found.' });
            }

            await company.destroy();

            // LOG: company deleted
            await auditLogController.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'COMPANY_DELETE',
                entity_type: 'Company',
                entity_id: company.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Company deleted successfully!' });
        } catch (error) {
            console.error('Delete Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // RESTORE
    async restore(req, res) {
        try {
            const { id } = req.params;

            const company = await Company.findByPk(id, { paranoid: false });
            
            if (!company) {
                return res.status(404).json({ error: 'Company not found.' });
            }

            if (company.deletedAt === null) {
                return res.status(400).json({ error: 'This company is already active.' });
            }

            await company.restore();

            // LOG: company restored
            await auditLogController.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'COMPANY_RESTORE',
                entity_type: 'Company',
                entity_id: company.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Company restored successfully!', company });
        } catch (error) {
            console.error('Restore Company error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = companyController;