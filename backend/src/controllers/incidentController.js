const { Incident } = require('../models');

const incidentController = {
    // CREATE
    async create(req, res) {
        try {
            const reported_by_user_id = req.user.id; 

            const { 
                company_id, asset_id, title, severity, status, cncs_form_data 
            } = req.body;

            const newIncident = await Incident.create({
                company_id,
                asset_id,
                reported_by_user_id,
                title,
                severity: severity || 'Medium',
                status: status || 'Open',
                cncs_form_data
            });

            return res.status(201).json({ message: 'Incident reported successfully!', incident: newIncident });
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company or asset does not exist.' });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors[0].message }); 
            }
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) {
                return res.status(400).json({ error: 'Invalid value provided for severity or status.' });
            }
            
            console.error('Create Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ALL
    async findAll(req, res) {
        try {
            const incidents = await Incident.findAll({
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(incidents);
        } catch (error) {
            console.error('Find All Incidents error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ONE
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const incident = await Incident.findByPk(id);
            
            if (!incident) {
                return res.status(404).json({ error: 'Incident not found.' });
            }

            return res.status(200).json(incident);
        } catch (error) {
            console.error('Find One Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const incident = await Incident.findByPk(id);
            
            if (!incident) {
                return res.status(404).json({ error: 'Incident not found.' });
            }

            await incident.update(updates);

            return res.status(200).json({ message: 'Incident updated successfully!', incident });
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company or asset does not exist.' });
            }
            if (error.name === 'SequelizeDatabaseError' && error.message.includes('enum')) {
                return res.status(400).json({ error: 'Invalid value provided for severity or status.' });
            }
            console.error('Update Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const incident = await Incident.findByPk(id);
            
            if (!incident) {
                return res.status(404).json({ error: 'Incident not found.' });
            }

            await incident.destroy();

            return res.status(200).json({ message: 'Incident deleted successfully!' });
        } catch (error) {
            console.error('Delete Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // RESTORE
    async restore(req, res) {
        try {
            const { id } = req.params;
            const incident = await Incident.findByPk(id, { paranoid: false });
            
            if (!incident) {
                return res.status(404).json({ error: 'Incident not found.' });
            }

            if (incident.deletedAt === null) {
                return res.status(400).json({ error: 'This incident is already active.' });
            }

            await incident.restore();

            return res.status(200).json({ message: 'Incident restored successfully!', incident });
        } catch (error) {
            console.error('Restore Incident error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = incidentController;