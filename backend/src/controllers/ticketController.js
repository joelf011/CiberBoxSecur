const { Ticket } = require('../models');
const { Op } = require('sequelize');

const ticketController = {
    // NEW TICKET
    async create(req, res) {
        try {
            const opened_by_user_id = req.user.id; 
            const { company_id, category, subject, description } = req.body;

            const activeTicket = await Ticket.findOne({
                where: {
                    company_id,
                    status: {
                        [Op.in]: ['Open', 'In Progress', 'Resolved']
                    }
                }
            });
            
            if (activeTicket) {
                return res.status(400).json({ 
                    error: 'You already have an active support ticket. Please wait for it to be resolved before opening a new one.' 
                });
            }

            const newTicket = await Ticket.create({
                company_id,
                opened_by_user_id,
                category,
                subject,
                description,
                // priority and status with defaultValue ('Medium' and 'Open')
                // assigned_to_user_id stay 'null'
            });

            return res.status(201).json({ message: 'Ticket opened successfully!', ticket: newTicket });
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company does not exist.' });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors[0].message }); 
            }
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) {
                return res.status(400).json({ error: 'Invalid value provided for category.' });
            }
            console.error('Create Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // LIST ALL
    async findAll(req, res) {
        try {
            const tickets = await Ticket.findAll({ order: [['createdAt', 'DESC']] });
            return res.status(200).json(tickets);
        } catch (error) {
            console.error('Find All Tickets error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // LIST ONE
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findByPk(id);
            
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            return res.status(200).json(ticket);
        } catch (error) {
            console.error('Find One Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE / CLAIM
    async update(req, res) {
        try {
            const { id } = req.params;
            
            // Manager can update priority, state and 'self' assigned_to_user_id
            const { category, priority, status, assigned_to_user_id } = req.body;

            const ticket = await Ticket.findByPk(id);
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            await ticket.update({ 
                category, 
                priority, 
                status, 
                assigned_to_user_id 
            });

            return res.status(200).json({ message: 'Ticket updated successfully!', ticket });
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified assigned user does not exist.' });
            }
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) {
                return res.status(400).json({ error: 'Invalid value provided for priority or status.' });
            }
            console.error('Update Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findByPk(id);
            
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

            await ticket.destroy();
            return res.status(200).json({ message: 'Ticket deleted successfully!' });
        } catch (error) {
            console.error('Delete Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // RESTORE
    async restore(req, res) {
        try {
            const { id } = req.params;
            const ticket = await Ticket.findByPk(id, { paranoid: false });
            
            if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
            if (ticket.deletedAt === null) return res.status(400).json({ error: 'This ticket is already active.' });

            await ticket.restore();
            return res.status(200).json({ message: 'Ticket restored successfully!', ticket });
        } catch (error) {
            console.error('Restore Ticket error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = ticketController;