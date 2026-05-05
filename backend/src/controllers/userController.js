const { User, Role, Company } = require('../models');

const userController = {
    async getProfile(req, res) {
        try {
            const userId = req.user.id;

            // Get all atributes from db (except pw)
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error('Get Profile error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = userController;