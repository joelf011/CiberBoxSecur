const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auditLogController = require('./auditLogController');

const authController = {
    // REGISTER
    async register(req, res) {
        try {
            const { name, email, password, role_id, company_id } = req.body;

            // Encrypt password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role_id: role_id || null,
                company_id: company_id || null,
                is_active: true
            });

            // Success log
            await auditLogController.logEvent({
                user_id: newUser.id,
                action: 'USER_REGISTER',
                entity_type: 'User',
                entity_id: newUser.id,
                ip_address: req.ip
            });

            // Return success
            return res.status(201).json({
                message: 'User created successfully!',
                user: { id: newUser.id, name: newUser.name, email: newUser.email }
            });

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'This email is already registered.' });
            }
            
            console.error('Register error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // LOGIN
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                // LOG: login attempt
                await auditLogController.logEvent({
                    user_id: null,
                    action: 'USER_LOGIN_FAILED_NOT_FOUND',
                    entity_type: 'User',
                    entity_id: null,
                    ip_address: req.ip
                });
                return res.status(404).json({ error: 'User not found.' });
            }

            // Is active?
            if (!user.is_active) {
                // LOG: Attempting to log in to a deactivated account
                await auditLogController.logEvent({
                    user_id: user.id,
                    action: 'USER_LOGIN_BLOCKED_INACTIVE',
                    entity_type: 'User',
                    entity_id: user.id,
                    ip_address: req.ip
                });
                return res.status(403).json({ error: 'This account is deactivated.' });
            }

            // Compare password with DB
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                // LOG: Wrong password
                await auditLogController.logEvent({
                    user_id: user.id,
                    action: 'USER_LOGIN_FAILED_WRONG_PASSWORD',
                    entity_type: 'User',
                    entity_id: user.id,
                    ip_address: req.ip
                });
                return res.status(401).json({ error: 'Wrong password.' });
            }

            // Generate token
            const token = jwt.sign(
                { id: user.id, role_id: user.role_id, company_id: user.company_id },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            // LOG: Login successful
            await auditLogController.logEvent({
                user_id: user.id,
                action: 'USER_LOGIN_SUCCESS',
                entity_type: 'User',
                entity_id: user.id,
                ip_address: req.ip
            });

            // Send token to React
            return res.status(200).json({
                message: 'Login success!',
                token,
                user: { id: user.id, name: user.name, role_id: user.role_id }
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = authController;