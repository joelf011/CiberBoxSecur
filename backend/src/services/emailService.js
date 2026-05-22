const nodemailer = require('nodemailer');

// Email server config
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "aa74b444fc2562",
    pass: "e73be95530e3d0"
  }
});

const emailService = {
    async sendActivationEmail(userEmail, userName, activationToken) {
        const activationLink = `http://localhost:5173/ativar-conta?token=${activationToken}`;

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
    }
};

module.exports = emailService;