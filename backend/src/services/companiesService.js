const { Company, User } = require('../models');
const auditLogService = require('./auditLogService')

const includeOptions = [
    { model: User, as: 'ClientOwner', attributes: ['id', 'name', 'email', 'phone'] },
    { model: User, as: 'EmergencyAdmin', attributes: ['id', 'name', 'phone'] },
    { model: User, as: 'AssignedAdmins', attributes: ['id', 'name'] }
];

const companyService = {
    async create(data, user, ipAddress) {
        const { assigned_admins, ...companyData } = data;

        // Create
        const newCompany = await Company.create({
            ...companyData,
            is_active: true,
            compliance_status: companyData.compliance_status || 'Awaiting'
        });

        if (assigned_admins && assigned_admins.length > 0) {
            await newCompany.setAssignedAdmins(assigned_admins);
        }

        // LOG
        await auditLogService.logEvent({
            user_id: user ? user.id : null,
            action: 'COMPANY_CREATE',
            entity_type: 'Company',
            entity_id: newCompany.id,
            ip_address: ipAddress
        });

        return newCompany;
    },

    async findAll() {
        return await Company.findAll({
            include: includeOptions,
            order: [['createdAt', 'DESC']]
        });
    },

    async findOne(id) {
        const company = await Company.findByPk(id, { include: includeOptions });
        if (!company) throw new Error('Company not found.');
        return company;
    },

    async update(id, data, user, ipAddress) {
        const company = await Company.findByPk(id);
        if (!company) throw new Error('Company not found.');

        const { assigned_admins, ...companyData } = data;

        // Uptade db
        await company.update(companyData);

        if (assigned_admins) {
            await company.setAssignedAdmins(assigned_admins);
        }

        // LOG
        await auditLogService.logEvent({
            user_id: user ? user.id : null,
            action: 'COMPANY_UPDATE',
            entity_type: 'Company',
            entity_id: company.id,
            ip_address: ipAddress
        });

        return company;
    },

    async delete(id, user, ipAddress) {
        const company = await Company.findByPk(id);
        if (!company) throw new Error('Company not found.');

        await company.destroy();

        // LOG
        await auditLogService.logEvent({
            user_id: user ? user.id : null,
            action: 'COMPANY_DELETE',
            entity_type: 'Company',
            entity_id: company.id,
            ip_address: ipAddress
        });

        return true;
    },

    async restore(id, user, ipAddress) {
        const company = await Company.findByPk(id, { paranoid: false });
        if (!company) throw new Error('Company not found.');
        
        if (company.deletedAt === null) {
            throw new Error('This company is already active.');
        }

        await company.restore();

        // LOG
        await auditLogService.logEvent({
            user_id: user ? user.id : null,
            action: 'COMPANY_RESTORE',
            entity_type: 'Company',
            entity_id: company.id,
            ip_address: ipAddress
        });

        return company;
    }
};

module.exports = companyService;