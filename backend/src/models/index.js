const sequelize = require('../config/database');

const Role = require('./Role');
const Permission = require('./Permission');
const User = require('./User');
const Company = require('./Company');

const Page = require('./Page');
const Article = require('./Article');
const Category = require('./Category');
const ArticleCategory = require('./ArticleCategory');

const Asset = require('./Asset');
const Document = require('./Document');
const Report = require('./Report');

const Incident = require('./Incident');
const Ticket = require('./Ticket');
const Chat = require('./Chat');
const ChatUser = require('./ChatUser');
const Message = require('./Message');

const AuditLog = require('./AuditLog');


Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// M:N Relation Roles <-> Permissions Pivot table
Role.belongsToMany(Permission, { through: 'Role_Permissions', foreignKey: 'role_id', timestamps: false });
Permission.belongsToMany(Role, { through: 'Role_Permissions', foreignKey: 'permission_id', timestamps: false });

Company.hasMany(User, { foreignKey: 'company_id' });
User.belongsTo(Company, { foreignKey: 'company_id' });

User.hasMany(Company, { foreignKey: 'manager_user_id', as: 'ManagedCompanies' });
Company.belongsTo(User, { foreignKey: 'manager_user_id', as: 'Manager' });

// --- CMS ---
User.hasMany(Page, { foreignKey: 'author_id' });
Page.belongsTo(User, { foreignKey: 'author_id' });

User.hasMany(Article, { foreignKey: 'author_id' });
Article.belongsTo(User, { foreignKey: 'author_id' });

Article.belongsToMany(Category, { through: ArticleCategory, foreignKey: 'article_id' });
Category.belongsToMany(Article, { through: ArticleCategory, foreignKey: 'category_id' });

// --- NIS2 Compliance ---
Company.hasMany(Asset, { foreignKey: 'company_id' });
Asset.belongsTo(Company, { foreignKey: 'company_id' });

Company.hasMany(Document, { foreignKey: 'company_id' });
Document.belongsTo(Company, { foreignKey: 'company_id' });
User.hasMany(Document, { foreignKey: 'uploaded_by_user_id' });
Document.belongsTo(User, { foreignKey: 'uploaded_by_user_id' });

Company.hasMany(Report, { foreignKey: 'company_id' });
Report.belongsTo(Company, { foreignKey: 'company_id' });
User.hasMany(Report, { foreignKey: 'created_by_user_id' });
Report.belongsTo(User, { foreignKey: 'created_by_user_id' });

// --- Comunication ---
Company.hasMany(Incident, { foreignKey: 'company_id' });
Incident.belongsTo(Company, { foreignKey: 'company_id' });
User.hasMany(Incident, { foreignKey: 'reported_by_user_id' });
Incident.belongsTo(User, { foreignKey: 'reported_by_user_id' });

Company.hasMany(Ticket, { foreignKey: 'company_id' });
Ticket.belongsTo(Company, { foreignKey: 'company_id' });
User.hasMany(Ticket, { foreignKey: 'opened_by_user_id' });
Ticket.belongsTo(User, { foreignKey: 'opened_by_user_id' });

Company.hasMany(Chat, { foreignKey: 'company_id' });
Chat.belongsTo(Company, { foreignKey: 'company_id' });

Chat.belongsToMany(User, { through: ChatUser, foreignKey: 'chat_id' });
User.belongsToMany(Chat, { through: ChatUser, foreignKey: 'user_id' });

Ticket.hasMany(Message, { foreignKey: 'ticket_id' });
Message.belongsTo(Ticket, { foreignKey: 'ticket_id' });

Chat.hasMany(Message, { foreignKey: 'chat_id' });
Message.belongsTo(Chat, { foreignKey: 'chat_id' });

User.hasMany(Message, { foreignKey: 'sender_id' });
Message.belongsTo(User, { foreignKey: 'sender_id' });

// --- Security ---
User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });


module.exports = {
    sequelize,
    Role,
    Permission,
    User,
    Company,
    Page,
    Article,
    Category,
    ArticleCategory,
    Asset,
    Document,
    Report,
    Incident,
    Ticket,
    Chat,
    ChatUser,
    Message,
    AuditLog
};