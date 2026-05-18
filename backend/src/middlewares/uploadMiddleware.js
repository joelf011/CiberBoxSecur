const multer = require('multer');
const path = require('path');
const fs = require('fs');

// FOLDER -> Uploads
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// SAVE file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    // RANDOM NAME
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// ONLY PDF, xls & IMAGES
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf', // PDF
        'image/jpeg', 'image/png', 'image/jpg', // Images
        'application/msword', // Word (.doc)
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
        'application/vnd.ms-excel', // Excel (.xls)
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (.xlsx)
        'text/csv', // CSV
        'text/plain' // .txt
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, Word, Excel, CSV, TXT and Images are allowed.'), false);
    }
};

// 50MB each file
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: fileFilter
});

module.exports = upload;