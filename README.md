# 🛡️ CyberBoxSecur - Plataforma de Cibersegurança e Gestão

Este projeto é uma plataforma Fullstack desenvolvida para a gestão de cibersegurança, clientes e ativos.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React, Vite, React-Router, Bootstrap, Axios.
- **Backend:** Node.js, Express, Sequelize ORM.
- **Base de Dados:** PostgreSQL.
- **Integrações:** Mailtrap (Sandbox de E-mails) e JWT para Autenticação.

---

## ⚙️ Configuração da Base de Dados e Arranque do Backend

O projeto utiliza o **Sequelize ORM**, logo, **não é necessário importar nenhum ficheiro SQL manualmente**. O sistema encarrega-se de criar as tabelas e injetar as Permissões, Cargos e a conta de Administração padrão através de Migrations e Seeders.

### Passo 1: Configurar Variáveis de Ambiente
1. Navegue até à pasta do backend.
2. Copie o ficheiro `.env.example` e renomeie-o para `.env`.
3. Preencha as credenciais da sua base de dados PostgreSQL e as chaves do Mailtrap (para testar o envio de e-mails de ativação de conta ou recuperação de passwords).

### Passo 2: Criar a Base de Dados
No seu PostgreSQL (pgAdmin ou command prompt), crie uma base de dados vazia com o nome definido no seu ficheiro `.env` (ex: `neondb`):
(```sql
CREATE DATABASE neondb
) Remover parêntises

### Passo 3: Inicializar o Sistema (Migrations e Seeders)
Abra o terminal dentro da pasta do Backend e execute os comandos pela seguinte ordem:

1. Instalar as dependências:
npm i

2. Criar as Tabelas:
npx sequelize-cli db:migrate

3. Injetar os Dados Vitais (OBRIGATÓRIO):
npx sequelize-cli db:seed:all

4. Iniciar o Servidor Local:
npm run dev

---

## 💻 Arranque do Frontend
Num novo terminal, navegue até à pasta do Frontend:

1. Instale as dependências:
npm i

2. Renomeie o ficheiro `.env.example` para `.env`. (Não é necessário alterar o conteúdo)

3. Inicie a interface:
npm run dev

---

## 🔐 Credenciais de Acesso (Contas Padrão)
Após executar o comando dos Seeders no backend, a plataforma está pronta a usar. Foram geradas automaticamente três contas de teste com diferentes níveis de acesso (RBAC) para avaliar as restrições de segurança do sistema.

**Password para todas as contas:** `Senha123!`

- **Administrador:** `admin@cyberboxsecur.com`
- **Gestor:** `gestor@cyberboxsecur.com`
- **Cliente:** `cliente@cyberboxsecur.com`
