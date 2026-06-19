const { Role, Permission, sequelize } = require('../models');
const auditLogService = require('../services/auditLogService');

/**
 * Responsável por:
 * - Gerir cargos e permissões associadas.
 * - Usar transações para manter Roles e Role_Permissions consistentes.
 *
 * Fluxo:
 * Backoffice -> Controller -> Transação Sequelize -> Roles/Permissions -> JSON.
 */
const roleController = {
    // Cria um cargo e as permissões associadas numa única transação.
    async create(req, res) {
        // A transação permite reverter cargo e pivot se uma das escritas falhar.
        const t = await sequelize.transaction();

        try {
            const { name, permissions } = req.body;

            // Registo base do cargo, necessário antes de preencher a tabela pivot.
            const newRole = await Role.create({ name }, { transaction: t });

            // Permissões recebidas como IDs vindos da matriz do frontend.
            if (permissions && Array.isArray(permissions) && permissions.length > 0) {
                // setPermissions escreve as linhas da tabela Role_Permissions.
                await newRole.setPermissions(permissions, { transaction: t });
            }

            await t.commit();

            // Recarrega o cargo com permissões para atualizar a UI sem novo pedido.
            const roleWithPermissions = await Role.findByPk(newRole.id, {
                include: { model: Permission, attributes: ['id', 'name'] }
            });

            // Auditoria separada da transação principal para não bloquear a resposta.
            await auditLogService.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'ROLE_CREATE',
                entity_type: 'Role',
                entity_id: newRole.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Role created successfully!', role: roleWithPermissions });
        } catch (error) {
            if (!t.finished) {
                 await t.rollback(); 
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This role name already exists.' });
            }
            console.error('Create Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Lista cargos com permissões, escondendo dados técnicos da tabela pivot.
    async findAll(req, res) {
        try {
            const roles = await Role.findAll({
                include: {
                    model: Permission,
                    attributes: ['id', 'name'],
                    through: { attributes: [] } // Evita devolver metadados da tabela pivot no JSON.
                },
                order: [['name', 'ASC']]
            });
            return res.status(200).json(roles);
        } catch (error) {
            console.error('Find All Roles error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Carrega um cargo com descrições das permissões para edição no modal.
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id, {
                include: {
                    model: Permission,
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                }
            });
            
            if (!role) return res.status(404).json({ error: 'Role not found.' });

            return res.status(200).json(role);
        } catch (error) {
            console.error('Find One Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Atualiza nome e matriz de permissões mantendo consistência transacional.
    async update(req, res) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { name, permissions } = req.body;

            const role = await Role.findByPk(id);
            
            if (!role) {
                await t.rollback();
                return res.status(404).json({ error: 'Role not found.' });
            }

            // O nome é opcional para permitir alterações apenas de permissões.
            if (name) {
                await role.update({ name }, { transaction: t });
            }

            // Substitui o conjunto completo de permissões pelo que veio do frontend.
            if (permissions && Array.isArray(permissions)) {
                await role.setPermissions(permissions, { transaction: t });
            }

            await t.commit();

            const updatedRole = await Role.findByPk(id, {
                include: { model: Permission, attributes: ['id', 'name'] }
            });

            // Log protegido para não falhar a atualização caso a auditoria tenha erro.
            try {
                await auditLogService.logEvent({
                    user_id: req.user ? req.user.id : null,
                    action: 'ROLE_UPDATE',
                    entity_type: 'Role',
                    entity_id: role.id,
                    ip_address: req.ip
                });
            } catch (logError) {
                 console.error("Error updating log:", logError);
            }

            return res.status(200).json({ message: 'Role updated successfully!', role: updatedRole });
        } catch (error) {
            if (!t.finished) {
                await t.rollback();
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This role name already exists.' });
            }
            console.error('Update Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Apaga logicamente o cargo, preservando histórico e relações.
    async delete(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);
            
            if (!role) {
                return res.status(404).json({ error: 'Role not found.' });
            }

            await role.destroy();

            // Regista a eliminação lógica do cargo.
            await auditLogService.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'ROLE_DELETE',
                entity_type: 'Role',
                entity_id: role.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Role deleted successfully!' });
        } catch (error) {
            console.error('Delete Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Restaura cargo previamente eliminado por soft delete.
    async restore(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id, { paranoid: false });
            
            if (!role) {
                return res.status(404).json({ error: 'Role not found.' });
            }

            if (role.deletedAt === null) {
                return res.status(400).json({ error: 'This role is already active.' });
            }

            await role.restore();

            // Regista o restauro para fechar o ciclo de auditoria.
            await auditLogService.logEvent({
                user_id: req.user ? req.user.id : null,
                action: 'ROLE_RESTORE',
                entity_type: 'Role',
                entity_id: role.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Role restored successfully!', role });
        } catch (error) {
            console.error('Restore Role error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = roleController;
