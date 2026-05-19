const { Role, Permission } = require('../models');
const auditLogController = require('../controllers/auditLogController');

// Receives the required permission name and returns the middleware
const checkPermission = (requiredPermissionName) => {
    return async (req, res, next) => {
        try {
            // If the user is not logged in (or if the authMiddleware failed) block access
            if (!req.user || !req.user.role_id) {
                return res.status(401).json({ error: 'Access denied: User or Role not found.' });
            }

            // Query the database for the users role
            const role = await Role.findByPk(req.user.role_id, {
                include: {
                    model: Permission,
                    where: { name: requiredPermissionName },
                    required: false
                }
            });

            // If the role doesnt exist or if the permissions array is empty
            if (!role || !role.Permissions || role.Permissions.length === 0) {
                
                // LOG: Unauthorized access attempt
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

            // The user holds the required permission -> proceed to the controller
            next();

        } catch (error) {
            console.error('Permission Check Middleware Error:', error);
            return res.status(500).json({ error: 'Internal server error while verifying permissions.' });
        }
    };
};

module.exports = checkPermission;