const { Company, User } = require('../models');
const auditLogService = require('./auditLogService')

/**
 * Responsável por:
 * - Persistir empresas e relações com cliente, contacto SOS e gestores atribuídos.
 * - Registar auditoria das alterações feitas no backoffice.
 *
 * Fluxo:
 * Controller -> Service -> Companies/CompanyAdmins -> AuditLogs -> Resposta à UI.
 */
const includeOptions = [
    { model: User, as: 'ClientOwner', attributes: ['id', 'name', 'email', 'phone'] },
    { model: User, as: 'EmergencyAdmin', attributes: ['id', 'name', 'phone'] },
    { model: User, as: 'AssignedAdmins', attributes: ['id', 'name'] }
];

const companyService = {
    async create(data, user, ipAddress) {
        const { assigned_admins, ...companyData } = data;

        // Cria a empresa antes de preencher a relação M:N com gestores atribuídos.
        const newCompany = await Company.create({
            ...companyData,
            is_active: true,
            compliance_status: companyData.compliance_status || 'Awaiting'
        });

        if (assigned_admins && assigned_admins.length > 0) {
            // Atualiza a tabela pivot CompanyAdmins com os gestores selecionados.
            await newCompany.setAssignedAdmins(assigned_admins);
        }

        // Auditoria associada ao utilizador que realizou a operação no backoffice.
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
        // Devolve já as relações necessárias para tabelas e modais de gestão.
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

        // Atualiza os campos diretos da empresa antes das relações M:N.
        await company.update(companyData);

        if (assigned_admins) {
            // Sincroniza a lista completa de gestores atribuídos à empresa.
            await company.setAssignedAdmins(assigned_admins);
        }

        // Regista alteração para rastreabilidade de dados empresariais.
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

        // Soft delete preserva histórico e relações para eventual restauro.
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

        // O restauro também é auditado para fechar o ciclo de vida do registo.
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
