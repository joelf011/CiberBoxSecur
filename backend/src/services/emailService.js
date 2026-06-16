const nodemailer = require('nodemailer');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Email server config
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const emailService = {
    async sendActivationEmail(userEmail, userName, activationToken) {
        const activationLink = `${FRONTEND_URL}/ativar-conta?token=${activationToken}`;

        const mailOptions = {
            from: '"CiberBoxSecur" <nao-responder@ciberboxsecur.com>',
            to: userEmail,
            subject: 'Ativação de Conta - CiberBoxSecur',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Bem-vindo à CiberBoxSecur, ${userName}!</h2>
                    <p>A sua conta foi criada com sucesso.</p>
                    <p>Para começar a usar a plataforma, clique no botão abaixo para definir a sua password:</p>
                    <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #0d6efd; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Ativar Minha Conta</a>
                    <p style="margin-top: 30px; font-size: 0.85em; color: #777;">Este link expira em 24 horas por motivos de segurança.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    },

    async sendPasswordResetEmail(userEmail, userName, resetToken) {
        const resetLink = `${FRONTEND_URL}/recuperar-password?token=${resetToken}`;

        const mailOptions = {
            from: '"CiberBoxSecur" <nao-responder@ciberboxsecur.com>',
            to: userEmail,
            subject: 'Recuperação de Password - CiberBoxSecur',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Olá, ${userName}</h2>
                    <p>Recebemos um pedido para repor a sua password na plataforma CiberBoxSecur.</p>
                    <p>Se foi o(a) próprio(a) a fazer este pedido, clique no botão abaixo para definir uma nova password:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Redefinir Password</a>
                    <p style="margin-top: 30px; font-size: 0.85em; color: #777;">Este link expira em 1 hora por motivos de segurança.</p>
                    <p style="font-size: 0.85em; color: #777;">Se não pediu a alteração da password, ignore este e-mail. A sua conta permanece segura.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    }
};

module.exports = emailService;