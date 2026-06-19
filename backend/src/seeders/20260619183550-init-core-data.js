'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ==========================================
    // INSERIR PERMISSÕES
    // ==========================================
    const permissions = [
      { id: 1, name: "MANAGE_ARTICLES", description: "Permite gerir globalmente todos os artigos" },
      { id: 2, name: "CREATE_ARTICLE", description: "Permite criar novos artigos" },
      { id: 3, name: "UPDATE_ARTICLE", description: "Permite editar artigos existentes" },
      { id: 4, name: "DELETE_ARTICLE", description: "Permite eliminar artigos" },
      { id: 5, name: "CREATE_ASSET", description: "Permite registar novos ativos" },
      { id: 6, name: "VIEW_ASSETS", description: "Permite listar e visualizar o inventário de ativos" },
      { id: 7, name: "UPDATE_ASSET", description: "Permite atualizar dados e classificações dos ativos" },
      { id: 8, name: "DELETE_ASSET", description: "Permite remover ativos do inventário (soft delete)" },
      { id: 9, name: "RESTORE_ASSET", description: "Permite restaurar ativos que foram eliminados" },
      { id: 10, name: "VIEW_AUDIT_LOGS", description: "Permite visualizar os registos de auditoria e segurança do sistema" },
      { id: 11, name: "CREATE_CATEGORY", description: "Permite criar novas categorias de notícias" },
      { id: 12, name: "UPDATE_CATEGORY", description: "Permite editar categorias existentes" },
      { id: 13, name: "DELETE_CATEGORY", description: "Permite remover categorias" },
      { id: 14, name: "USE_CHAT", description: "Permite aceder e interagir no chat de suporte e fórum de clientes" },
      { id: 15, name: "CREATE_COMPANY", description: "Permite registar novas empresas cliente" },
      { id: 16, name: "VIEW_COMPANIES", description: "Permite listar e ver os detalhes das empresas" },
      { id: 17, name: "UPDATE_COMPANY", description: "Permite atualizar os dados das empresas" },
      { id: 18, name: "DELETE_COMPANY", description: "Permite remover empresas do sistema" },
      { id: 19, name: "RESTORE_COMPANY", description: "Permite reativar empresas que tinham sido removidas" },
      { id: 20, name: "CREATE_DOCUMENT", description: "Permite fazer upload de novos documentos" },
      { id: 21, name: "VIEW_DOCUMENTS", description: "Permite aceder e descarregar documentos" },
      { id: 22, name: "UPDATE_DOCUMENT", description: "Permite modificar metadados e versões de documentos" },
      { id: 23, name: "DELETE_DOCUMENT", description: "Permite remover documentos" },
      { id: 24, name: "RESTORE_DOCUMENT", description: "Permite recuperar documentos que foram eliminados" },
      { id: 25, name: "CREATE_INCIDENT", description: "Permite registar novos incidentes" },
      { id: 26, name: "VIEW_INCIDENTS", description: "Permite visualizar os detalhes de incidentes" },
      { id: 27, name: "UPDATE_INCIDENT", description: "Permite atualizar o estado de mitigação e dados de incidentes" },
      { id: 28, name: "DELETE_INCIDENT", description: "Permite remover registos de incidentes" },
      { id: 29, name: "RESTORE_INCIDENT", description: "Permite recuperar registos de incidentes eliminados" },
      { id: 30, name: "VIEW_PERMISSIONS", description: "Permite visualizar a lista global de permissões do sistema" },
      { id: 34, name: "VIEW_REPORTS", description: "Permite aceder e visualizar relatórios de risco e conformidade" },
      { id: 35, name: "CREATE_REPORT", description: "Permite gerar e compilar novos relatórios no sistema" },
      { id: 36, name: "UPDATE_REPORT", description: "Permite editar informações contidas nos relatórios" },
      { id: 37, name: "DELETE_REPORT", description: "Permite eliminar relatórios" },
      { id: 38, name: "CREATE_ROLE", description: "Permite criar novos cargos no sistema" },
      { id: 39, name: "VIEW_ROLES", description: "Permite listar e visualizar os cargos existentes" },
      { id: 40, name: "UPDATE_ROLE", description: "Permite associar ou remover permissões de um determinado cargo" },
      { id: 41, name: "DELETE_ROLE", description: "Permite eliminar cargos do sistema" },
      { id: 42, name: "RESTORE_ROLE", description: "Permite reativar cargos que foram desativados" },
      { id: 43, name: "CREATE_TICKET", description: "Permite abrir novos pedidos de suporte técnico" },
      { id: 44, name: "VIEW_TICKETS", description: "Permite gerir e visualizar a fila de tickets de suporte" },
      { id: 45, name: "UPDATE_TICKET", description: "Permite responder, encaminhar e alterar o estado de tickets" },
      { id: 46, name: "DELETE_TICKET", description: "Permite encerrar ou apagar tickets do sistema" },
      { id: 47, name: "RESTORE_TICKET", description: "Permite recuperar tickets que foram eliminados" },
      { id: 48, name: "CREATE_USER", description: "Permite registar novos utilizadores no sistema" },
      { id: 49, name: "VIEW_USERS", description: "Permite aceder à área de Gestão de Utilizadores e listar contas" },
      { id: 50, name: "UPDATE_USER", description: "Permite editar os perfis, dados e atribuição de cargos a utilizadores" },
      { id: 51, name: "DELETE_USER", description: "Permite suspender ou remover utilizadores do sistema" },
      { id: 52, name: "RESTORE_USER", description: "Permite reativar utilizadores que estavam suspensos" },
      { id: 106, name: "UPDATE_CMS", description: "Permite editar o conteúdo da página inicial" }
    ];
    await queryInterface.bulkInsert('Permissions', permissions, {});

    // ==========================================
    // INSERIR CARGOS GENÉRICOS (com created_at e updated_at)
    // ==========================================
    const roles = [
      { id: 1, name: 'Administrador', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'Gestor', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'Cliente', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'Editor de Conteúdo', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'Visualizador', created_at: new Date(), updated_at: new Date() }
    ];
    await queryInterface.bulkInsert('Roles', roles, {});

    // ==========================================
    // LIGAR CARGOS ÀS PERMISSÕES (SEM datas forçadas)
    // ==========================================
    const rawRolePermissions = [
      { "role_id": 1, "permission_id": 1 }, { "role_id": 1, "permission_id": 2 }, { "role_id": 1, "permission_id": 3 }, { "role_id": 1, "permission_id": 4 }, { "role_id": 1, "permission_id": 5 }, { "role_id": 1, "permission_id": 6 }, { "role_id": 1, "permission_id": 7 }, { "role_id": 1, "permission_id": 8 }, { "role_id": 1, "permission_id": 9 }, { "role_id": 1, "permission_id": 10 }, { "role_id": 1, "permission_id": 11 }, { "role_id": 1, "permission_id": 12 }, { "role_id": 1, "permission_id": 13 }, { "role_id": 1, "permission_id": 14 }, { "role_id": 1, "permission_id": 15 }, { "role_id": 1, "permission_id": 16 }, { "role_id": 1, "permission_id": 17 }, { "role_id": 1, "permission_id": 18 }, { "role_id": 1, "permission_id": 19 }, { "role_id": 1, "permission_id": 20 }, { "role_id": 1, "permission_id": 21 }, { "role_id": 1, "permission_id": 22 }, { "role_id": 1, "permission_id": 23 }, { "role_id": 1, "permission_id": 24 }, { "role_id": 1, "permission_id": 25 }, { "role_id": 1, "permission_id": 26 }, { "role_id": 1, "permission_id": 27 }, { "role_id": 1, "permission_id": 28 }, { "role_id": 1, "permission_id": 29 }, { "role_id": 1, "permission_id": 30 }, { "role_id": 1, "permission_id": 34 }, { "role_id": 1, "permission_id": 35 }, { "role_id": 1, "permission_id": 36 }, { "role_id": 1, "permission_id": 37 }, { "role_id": 1, "permission_id": 38 }, { "role_id": 1, "permission_id": 39 }, { "role_id": 1, "permission_id": 40 }, { "role_id": 1, "permission_id": 41 }, { "role_id": 1, "permission_id": 42 }, { "role_id": 1, "permission_id": 43 }, { "role_id": 1, "permission_id": 44 }, { "role_id": 1, "permission_id": 45 }, { "role_id": 1, "permission_id": 46 }, { "role_id": 1, "permission_id": 47 }, { "role_id": 1, "permission_id": 48 }, { "role_id": 1, "permission_id": 49 }, { "role_id": 1, "permission_id": 50 }, { "role_id": 1, "permission_id": 51 }, { "role_id": 1, "permission_id": 52 }, { "role_id": 1, "permission_id": 106 },
      { "role_id": 2, "permission_id": 1 }, { "role_id": 2, "permission_id": 2 }, { "role_id": 2, "permission_id": 3 }, { "role_id": 2, "permission_id": 4 }, { "role_id": 2, "permission_id": 5 }, { "role_id": 2, "permission_id": 6 }, { "role_id": 2, "permission_id": 7 }, { "role_id": 2, "permission_id": 8 }, { "role_id": 2, "permission_id": 9 }, { "role_id": 2, "permission_id": 14 }, { "role_id": 2, "permission_id": 16 }, { "role_id": 2, "permission_id": 17 }, { "role_id": 2, "permission_id": 20 }, { "role_id": 2, "permission_id": 21 }, { "role_id": 2, "permission_id": 22 }, { "role_id": 2, "permission_id": 23 }, { "role_id": 2, "permission_id": 24 }, { "role_id": 2, "permission_id": 25 }, { "role_id": 2, "permission_id": 26 }, { "role_id": 2, "permission_id": 27 }, { "role_id": 2, "permission_id": 28 }, { "role_id": 2, "permission_id": 29 }, { "role_id": 2, "permission_id": 34 }, { "role_id": 2, "permission_id": 35 }, { "role_id": 2, "permission_id": 36 }, { "role_id": 2, "permission_id": 37 }, { "role_id": 2, "permission_id": 43 }, { "role_id": 2, "permission_id": 44 }, { "role_id": 2, "permission_id": 45 }, { "role_id": 2, "permission_id": 46 }, { "role_id": 2, "permission_id": 47 },
      { "role_id": 3, "permission_id": 5 }, { "role_id": 3, "permission_id": 6 }, { "role_id": 3, "permission_id": 7 }, { "role_id": 3, "permission_id": 8 }, { "role_id": 3, "permission_id": 14 }, { "role_id": 3, "permission_id": 20 }, { "role_id": 3, "permission_id": 21 }, { "role_id": 3, "permission_id": 22 }, { "role_id": 3, "permission_id": 23 }, { "role_id": 3, "permission_id": 25 }, { "role_id": 3, "permission_id": 26 }, { "role_id": 3, "permission_id": 34 }, { "role_id": 3, "permission_id": 43 }, { "role_id": 3, "permission_id": 44 },
      { "role_id": 4, "permission_id": 1 }, { "role_id": 4, "permission_id": 2 }, { "role_id": 4, "permission_id": 3 }, { "role_id": 4, "permission_id": 4 }, { "role_id": 4, "permission_id": 11 }, { "role_id": 4, "permission_id": 12 }, { "role_id": 4, "permission_id": 13 }, { "role_id": 4, "permission_id": 106 },
      { "role_id": 5, "permission_id": 39 }
    ];
    await queryInterface.bulkInsert('Role_Permissions', rawRolePermissions, {});

    // ==========================================
    // CRIAR OS 3 UTILIZADORES (com created_at e updated_at)
    // ==========================================
    const hashedPassword = await bcrypt.hash('Senha123!', 10); 

    const users = [
      {
        id: 1,
        name: 'Super Administrador',
        email: 'admin@cyberboxsecur.com',
        password: hashedPassword,
        phone: '912345678',
        role_id: 1, 
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Gestor Operacional',
        email: 'gestor@cyberboxsecur.com',
        password: hashedPassword,
        phone: '923456789',
        role_id: 2, 
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'Cliente Parceiro',
        email: 'cliente@cyberboxsecur.com',
        password: hashedPassword,
        phone: '934567890',
        role_id: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    const testEmails = ['admin@cyberboxsecur.com', 'gestor@cyberboxsecur.com', 'cliente@cyberboxsecur.com'];
    await queryInterface.bulkDelete('Users', { email: testEmails }, {});
    await queryInterface.bulkDelete('Role_Permissions', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
