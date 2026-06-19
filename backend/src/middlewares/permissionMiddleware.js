/**
 * Middleware de verificação de permissões (autorização).
 *
 * Responsável por:
 * - Receber o nome da permissão exigida e devolver um middleware reutilizável.
 * - Consultar a BD para verificar se o role do utilizador possui a permissão.
 * - Registar tentativas de acesso não autorizado no audit log.
 *
 * Depende de: authMiddleware (req.user já deve estar preenchido).
 *
 * Fluxo:
 * req.user.role_id → Role.findByPk (com Permissions) → Permite ou bloqueia → Audit Log se negado.
 */

const { Role, Permission } = require('../models');
const auditLogController = require('../controllers/auditLogController');

// Função de ordem superior: recebe o nome da permissão e devolve o middleware.
const checkPermission = (requiredPermissionName) => {
    return async (req, res, next) => {
        try {
            // Garante que o authMiddleware já injetou o utilizador e o seu role.
            if (!req.user || !req.user.role_id) {
                return res.status(401).json({ error: 'Access denied: User or Role not found.' });
            }

            // Consulta o role e filtra pela permissão exigida na tabela pivot role_permissions.
            const role = await Role.findByPk(req.user.role_id, {
                include: {
                    model: Permission,
                    where: { name: requiredPermissionName },
                    required: false
                }
            });

            // Se o role não existir ou não tiver a permissão associada, nega o acesso.
            if (!role || !role.Permissions || role.Permissions.length === 0) {
                
                // Regista a tentativa de acesso não autorizado para auditoria.
                await auditLogController.logEvent({
                    user_id: req.user.id,
                    action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
                    entity_type: 'Permission',
                    entity_id: null,
                    ip_address: req.ip
                });

                return res.status(403).json({ 
                    error: `Forbidden: You do not have the required permission (${requiredPermissionName}) to perform this action.` 
                });
            }

            // Permissão válida — avança para o controller.
            next();

        } catch (error) {
            console.error('Permission Check Middleware Error:', error);
            return res.status(500).json({ error: 'Internal server error while verifying permissions.' });
        }
    };
};

module.exports = checkPermission;