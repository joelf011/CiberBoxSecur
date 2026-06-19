/**
 * Modelo Document — Documento de conformidade NIS2.
 *
 * Responsável por:
 * - Armazenar documentos carregados no âmbito da conformidade NIS2 (políticas, relatórios, templates).
 * - Gerir o fluxo de aprovação de documentos entre administradores e clientes.
 * - Suportar versionamento através de referência ao documento pai (parent_document_id).
 *
 * Relações:
 * - Pertence a uma Company (company_id) — empresa à qual o documento diz respeito.
 * - Pertence a um User (uploaded_by_user_id) — utilizador que carregou o documento.
 * - Referência própria opcional (parent_document_id) — documento anterior/versão original.
 *
 * Fluxo:
 * Upload -> Informational/Pending_Client -> Submitted -> Approved/Rejected.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // FK -> Companies.id — empresa proprietária do documento.
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Companies', key: 'id' }
    },
    // FK -> Users.id — utilizador que fez o upload do documento.
    uploaded_by_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    // Categoria do documento para organização no âmbito NIS2.
    document_category: { 
        type: DataTypes.ENUM('Policies', 'Network', 'Training', 'Incident_Response', 'Templates', 'Other'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Caminho no sistema de ficheiros onde o documento está armazenado.
    file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Indica se o documento requer ação por parte do cliente (ex: preenchimento, assinatura).
    is_action_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // Estado do documento no fluxo de aprovação.
    status: {
        type: DataTypes.ENUM('Informational', 'Pending_Client', 'Submitted', 'Approved', 'Rejected'),
        defaultValue: 'Informational'
    },
    // FK -> Documents.id — referência ao documento original (suporta versionamento).
    parent_document_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Documents', key: 'id' }
    }
}, {
    tableName: 'Documents',
    timestamps: true,
    paranoid: true
});

module.exports = Document;