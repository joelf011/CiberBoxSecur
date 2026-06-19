const userService = require('../services/userService');

/**
 * Responsável por:
 * - Expor operações de perfil próprio e gestão administrativa de utilizadores.
 * - Delegar hashing, validações e auditoria no userService.
 *
 * Fluxo:
 * Frontend -> UserController -> UserService -> Users/AuditLogs -> Resposta.
 */
const userController = {
    async getProfile(req, res) {
        try {
            const user = await userService.getProfile(req.user.id);
            return res.status(200).json(user);
        } catch (error) {
            console.error('Get Profile error:', error);
            return res.status(404).json({ error: error.message || 'Internal server error' });
        }
    },

    // Atualiza o perfil do próprio utilizador autenticado.
    async updateProfile(req, res) {
        try {
            await userService.updateProfile(req.user.id, req.body, req.ip);
            return res.status(200).json({ message: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Update Profile error:', error);
            return res.status(400).json({ error: error.message || 'Internal server error' });
        }
    },

    // Lista utilizadores para o painel administrativo.
    async getAllAdmin(req, res) {
        try {
            const users = await userService.getAllAdmin();
            return res.status(200).json(users);
        } catch (error) {
            console.error('Get All Users error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Atualiza utilizador a partir da área administrativa.
    async updateAdmin(req, res) {
        try {
            await userService.updateAdmin(req.params.id, req.body, req.user.id, req.ip);
            return res.status(200).json({ message: 'User updated successfully by Admin!' });
        } catch (error) {
            console.error('Update User Admin error:', error);
            return res.status(400).json({ error: error.message || 'Internal server error' });
        }
    },

    // Apaga logicamente utilizador a partir da área administrativa.
    async delete(req, res) {
        try {
            await userService.deleteUser(req.params.id, req.user.id, req.ip);
            return res.status(200).json({ message: 'User deleted successfully!' });
        } catch (error) {
            console.error('Delete User error:', error);
            return res.status(400).json({ error: error.message || 'Internal server error' });
        }
    }
};

module.exports = userController;
