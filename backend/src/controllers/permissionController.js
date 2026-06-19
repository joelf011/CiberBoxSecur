const { Permission } = require('../models');
const auditLogController = require('./auditLogController');

/**
 * Responsável por:
 * - Disponibilizar a lista de permissões para a gestão de cargos.
 *
 * Fluxo:
 * Backoffice -> PermissionController -> Permissions -> Matriz de permissões na UI.
 */
const permissionController = {
    // Lista permissões ordenadas para construir a matriz de cargos no frontend.
    async getAll(req, res) {
        try {
            const permissions = await Permission.findAll({
                order: [['name', 'ASC']]
            });
            return res.status(200).json(permissions);
        } catch (error) {
            console.error('Get Permissions error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },
};

module.exports = permissionController;
