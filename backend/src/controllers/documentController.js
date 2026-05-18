const { Document } = require('../models');
const fs = require('fs');

const documentController = {
    // CREATE
    async create(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No document file provided.' });
            }

            const uploaded_by_user_id = req.user.id; 
            
            const { 
                company_id, 
                document_category, 
                title, 
                is_action_required, 
                status, 
                parent_document_id 
            } = req.body;

            const file_path = `uploads/${req.file.filename}`;

            const newDocument = await Document.create({
                company_id,
                uploaded_by_user_id,
                document_category,
                title,
                file_path,
                is_action_required: is_action_required === 'true' || is_action_required === true,
                status: status || 'Informational',
                parent_document_id: parent_document_id || null
            });

            return res.status(201).json({ message: 'Document uploaded successfully!', document: newDocument });
        } catch (error) {
            if (req.file){
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ error: 'The specified company or parent document does not exist.' });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: error.errors[0].message }); 
            }
            console.error('Upload Document error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // LIST ALL
    async findAll(req, res) {
        try {
            const documents = await Document.findAll({ order: [['createdAt', 'DESC']] });
            return res.status(200).json(documents);
        } catch (error) {
            console.error('Find All Documents error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const { id } = req.params;
            // Admin change status
            const { title, document_category, status } = req.body;

            const document = await Document.findByPk(id);
            if (!document) return res.status(404).json({ error: 'Document not found.' });

            await document.update({ title, document_category, status });
            return res.status(200).json({ message: 'Document details updated!', document });
        } catch (error) {
            console.error('Update Document error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // DELETE (Soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const document = await Document.findByPk(id);
            
            if (!document) return res.status(404).json({ error: 'Document not found.' });

            await document.destroy();
            return res.status(200).json({ message: 'Document deleted successfully!' });
        } catch (error) {
            console.error('Delete Document error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // RESTORE
    async restore(req, res) {
        try {
            const { id } = req.params;
            const document = await Document.findByPk(id, { paranoid: false });
            
            if (!document) return res.status(404).json({ error: 'Document not found.' });
            if (document.deletedAt === null) return res.status(400).json({ error: 'This document is already active.' });

            await document.restore();
            return res.status(200).json({ message: 'Document restored successfully!', document });
        } catch (error) {
            console.error('Restore Document error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = documentController;