const express = require('express');
const router = express.Router();
const { v4: uuidv4 }= require('uuid');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { sendAnEmail} = require('../utils/emailService')

const db = require('../model/db')
const sq = db.sequelize

// This is file router
// URL PATH: /api/file/upload
router.post('/upload', upload.single('file'), async (req, res) => {

    let uploadedFile = req.file;
    let fileName = req.file.originalname

    if (!uploadedFile) return res.status(422).json({ errMsg: 'No file uploaded'})

    //ensure user only upload .txt file and delete any old file
    if  (uploadedFile.mimetype !== 'text/plain') {
        fs.unlinkSync(uploadedFile.path) // delete the uploaded file
        return res.status(422).json({ errMsg: 'Only .txt file is allowed'})
    }


    fs.readFile(uploadedFile.path, 'utf8', async (err, data) => {
        if (err) return res.status(400).json({ errMsg: 'Error reading the file'})

        if (data) {
            let transaction;

            try {
                transaction = await sq.transaction();

                await db.file_uploads.create({
                    file_name: fileName,
                    file_path: `uploads/${fileName}`

                })

                let subject = 'Test Email from API'
                let text = 'This is an email from API. The content of the uploaded file is --> ' + data
                let sendTo = `zulaikhalyka03@gmail.com`

                await sendAnEmail(sendTo, subject, text)


                await transaction.commit();

                return res.status(200).json({ message: 'File uploaded and record saved successfully'})

            } catch (error) {
                if (transaction) await transaction.rollback();
                console.error('Error during file upload and record save:', error);
                return res.status(500).json({ errMsg: 'Internal server error'})
            }
        }
    })
})



module.exports = router;