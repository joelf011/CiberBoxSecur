/**
 * Middleware de upload de ficheiros (Multer).
 *
 * Responsável por:
 * - Guardar ficheiros em disco na pasta /uploads.
 * - Gerar nomes únicos para evitar colisões.
 * - Filtrar tipos MIME permitidos (PDF, Word, Excel, CSV, TXT, imagens).
 * - Limitar o tamanho máximo por ficheiro a 50 MB.
 *
 * Utilizado nos controllers de documentos, artigos e outros que aceitem anexos.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que a pasta de uploads existe ao arrancar o servidor.
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento em disco com nome único por ficheiro.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    // Prefixo com timestamp + número aleatório para evitar nomes duplicados.
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Filtro de tipos MIME — rejeita ficheiros que não sejam documentos ou imagens suportadas.
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg', 'image/png', 'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, Word, Excel, CSV, TXT and Images are allowed.'), false);
    }
};

// Instância final do Multer com limite de 50 MB por ficheiro.
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: fileFilter
});

module.exports = upload;