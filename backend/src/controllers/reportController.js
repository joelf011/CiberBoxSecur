const { Report, User, Company } = require('../models');
const fs = require('fs');
const auditLogService = require('../services/auditLogService');

/**
 * Responsável por:
 * - Gerir relatórios associados a empresas e ficheiros carregados.
 * - Garantir limpeza de uploads quando a operação falha.
 *
 * Fluxo:
 * Frontend -> Upload(Multer) -> Controller -> Reports -> AuditLogs -> Resposta.
 */
const reportController = {
    // Cria relatório com ficheiro físico obrigatório e metadados na base de dados.
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
                file_path: `uploads/${req.file.filename}`,
                status: status || 'Draft'
            });

            // Regista a criação para auditoria administrativa.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'REPORT_CREATE',
                entity_type: 'Report',
                entity_id: newReport.id,
                ip_address: req.ip
            });

            return res.status(201).json({ message: 'Report created successfully!', data: newReport });
        } catch (error) {
            // Se a persistência falhar, remove o ficheiro recebido para evitar órfãos.
            if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            
            console.error('Create Report error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Lista relatórios filtrados pela empresa quando o utilizador é cliente.
    async getAll(req, res) {
        try {
            // Admins sem company_id veem todos; clientes ficam limitados à própria empresa.
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

    // Devolve um relatório específico com validação de acesso por empresa.
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

    // Atualiza metadados e substitui o ficheiro quando existe novo upload.
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, report_type, risk_score, status } = req.body;

            const report = await Report.findByPk(id);
            if (!report) {
                if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                return res.status(404).json({ error: 'Report not found.' });
            }

            // Proteção IDOR antes de aceitar alterações ou guardar novo ficheiro.
            if (req.user.company_id && report.company_id !== req.user.company_id) {
                if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                return res.status(403).json({ error: 'Forbidden.' });
            }

            let file_path = report.file_path;
            
            // Substitui o ficheiro físico apenas quando o frontend enviou um novo.
            if (req.file) {
                // Remove o ficheiro anterior para não deixar versões soltas no disco.
                if (fs.existsSync(report.file_path)) {
                    fs.unlinkSync(report.file_path);
                }
                // Guarda o caminho relativo que será servido pela API.
                file_path = `uploads/${req.file.filename}`;
            }

            await report.update({ title, report_type, risk_score, status, file_path });

            // Regista a alteração do relatório no histórico de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'REPORT_UPDATE',
                entity_type: 'Report',
                entity_id: report.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Report updated successfully!', data: report });
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            console.error('Update Report error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    },

    // Apaga logicamente o relatório para manter histórico e permitir auditoria.
    async delete(req, res) {
        try {
            const { id } = req.params;
            const report = await Report.findByPk(id);

            if (!report) return res.status(404).json({ error: 'Report not found.' });

            // Proteção IDOR: cliente não pode apagar relatório de outra empresa.
            if (req.user.company_id && report.company_id !== req.user.company_id) {
                return res.status(403).json({ error: 'Forbidden.' });
            }

            await report.destroy();

            // Regista a eliminação lógica no log de auditoria.
            await auditLogService.logEvent({
                user_id: req.user.id,
                action: 'REPORT_DELETE',
                entity_type: 'Report',
                entity_id: report.id,
                ip_address: req.ip
            });

            return res.status(200).json({ message: 'Report deleted successfully!' });
        } catch (error) {
            console.error('Delete Report error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
};

module.exports = reportController;
