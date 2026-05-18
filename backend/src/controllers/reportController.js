const { Report, User, Company } = require('../models');
const fs = require('fs');

const reportController = {
    // CREATE
    async create(req, res) {
        try {
            const { company_id, report_type, title, risk_score, status } = req.body;
            
            if (!req.file) {
                return res.status(400).json({ error: 'Report file (PDF/Doc) is required.' });
            }

            const newReport = await Report.create({
                company_id,
                created_by_user_id: req.user.id,
                report_type,
                title,
                risk_score: risk_score || null,
                file_path: `uploads/reports/${req.file.filename}`,
                status: status || 'Draft'
            });

            return res.status(201).json({ message: 'Report created successfully!', data: newReport });
        } catch (error) {
            // delete in case of an error
            if (req.file) fs.unlinkSync(req.file.path);
            
            console.error('Create Report error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ALL
    async getAll(req, res) {
        try {
            // Filter by company of the user logged
            // Ignore if admin
            let whereClause = {};
            if (req.user.company_id) {
                whereClause.company_id = req.user.company_id;
            }

            const reports = await Report.findAll({
                where: whereClause,
                include: [
                    { model: User, attributes: ['id', 'name', 'email'] },
                    { model: Company, attributes: ['id', 'name'] }
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json(reports);
        } catch (error) {
            console.error('Get Reports error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // READ ONE
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const report = await Report.findByPk(id, {
                include: [
                    { model: User, attributes: ['name'] },
                    { model: Company, attributes: ['name'] }
                ]
            });

            if (!report) return res.status(404).json({ error: 'Report not found.' });

            if (req.user.company_id && report.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden: You do not have access to this report.' });
            }

            return res.status(200).json(report);
        } catch (error) {
            console.error('Get One Report error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, report_type, risk_score, status } = req.body;

            const report = await Report.findByPk(id);
            if (!report) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(404).json({ error: 'Report not found.' });
            }

            let file_path = report.file_path;
            
            // If new file uploaded
            if (req.file) {
                // DELETE the old file
                if (fs.existsSync(report.file_path)) {
                    fs.unlinkSync(report.file_path);
                }
                // New path
                file_path = `uploads/reports/${req.file.filename}`;
            }

            await report.update({ title, report_type, risk_score, status, file_path });

            return res.status(200).json({ message: 'Report updated successfully!', data: report });
        } catch (error) {
            if (req.file) fs.unlinkSync(req.file.path);
            console.error('Update Report error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const report = await Report.findByPk(id);

            if (!report) return res.status(404).json({ error: 'Report not found.' });

            // Protection
            if (req.user.company_id && report.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await report.destroy();
            return res.status(200).json({ message: 'Report deleted successfully!' });
        } catch (error) {
            console.error('Delete Report error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = reportController;