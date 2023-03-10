const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const PORT = 7000;
const app = express();
const router = express.Router();

const HEADER = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Connection": "keep-alive",
    "Keep-Alive": "timeout=5"
}

function setupDatabase(){
    const db = new sqlite3.Database(':memory');
    const statement = `
        CREATE TABLE IF NOT EXISTS images(
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            author varchar(128) NOT NULL,
            image varchar(512) NOT NULL,
            tags varchar(512) NOT NULL,
            description varchar(2048) NOT NULL,
            alt varchar(256) NOT NULL
        );
    `;

    db.run(statement);

    db.close();
}


router.post('/', async (req, res) => {
    res.set(HEADER);

    const { image, author, tags, description, alt } = req.body;

    if(!image || !author || !tags || !description || !alt ){
        const errMessage = `${!image ? 'Image Url is not present.': ''}${!author ? 'Author is not present.': ''}${!tags ? 'Tags not present.': ''}${!description ? 'Description is not present.': ''}${!alt ? 'Alt not present.': ''}`;

        res.status(400).json({message: errMessage});
        return;
    }

    const db = new sqlite3.Database(':memory', sqlite3.OPEN_READWRITE);
    const statement = `INSERT INTO images (image, author, tags, description, alt) VALUES (?, ?, ?, ?, ?)`;

    db.run(statement, [image, author, tags, description, alt], (err) => {
        if(err){
            res.status(500).json({message: `database error. ${err}`});
            return;
        }

        res.status(201).send();
    });

    db.close();
});

router.get('/', async (req, res) => {
    res.set(HEADER);

    const {id} = req.query;

    if(id && !Number(id) && !(Number(id) === 0)){
        res.status(400).send({message: 'id is not a number'});
        return;
    }

    const db = new sqlite3.Database(':memory', sqlite3.OPEN_READONLY);

    let statement = `SELECT id, image, author, tags, description, alt FROM images`;
    let args = [];

    if(id){
        statement += ` WHERE id=?`;
        args.push(id);
    }

    db.all(statement, args, (err, rows) => {
        if (err) {
            res.status(500).json({message: `Database error. ${err}`});
            return;
        }

        if(rows.length == 0 && id){
            res.status(404).json({message: 'image by id is not found'});
            return;
        }

        res.status(200).json(rows);
    });

    db.close();
});

router.put('/', async (req, res) => {
    res.set(HEADER);

    const { id, image, author, tags, description, alt } = req.body;

    if(!id || !image || !author || !tags || !description || !alt ){
        const errMessage = `${!id ? 'Id is not present. ': ''} ${!image ? 'Image Url is not present. ': ''} ${!author ? 'Author is not present. ': ''} 
        ${!tags ? 'Tags not present. ': ''} ${!description ? 'Description is not present. ': ''} ${!alt ? 'Alt not present. ': ''}`;

        res.status(400).json({message: errMessage});
        return;
    }

    if(!Number(id) && !(Number(id) === 0)){
        res.status(400).json({message: 'id must be an integer'});
        return;
    }

    const db = new sqlite3.Database(':memory', sqlite3.OPEN_READWRITE);
    let statement = `SELECT image FROM images WHERE id=?`;

    db.all(statement, [id], (err, rows) => {
        if (err) {
            res.status(500).json({message: `Database error. ${err}`});
            return;
        }

        if(rows.length == 0){
            statement = `INSERT INTO images (id, image, author, tags, description, alt) VALUES (?, ?, ?, ?, ?, ?)`;
            db.run(statement, [id, image, author, tags, description, alt], (err) => {
                if(err){
                    res.status(201).send();
                    return;
                }
            });
        }

        statement = `UPDATE images SET image=?, author=?, tags=?, description=?, alt=? WHERE id=?`;
        db.run(statement, [image, author, tags, description, alt, id], (err) => {
            if(err){
                res.status(204).send();
                return;
            }
        });
    });

    res.status(201).send();

    db.close();
});

router.delete('/', async (req, res) => {
    res.set(HEADER);

    const { id } = req.body;

    if(!id){
        res.status(400).json({message: 'id was not specified'});
        return;
    }

    if(!Number(id) && !(Number(id) === 0)){
        res.status(400).json({message: 'id must be an integer'});
        return;
    }

    const db = new sqlite3.Database(':memory', sqlite3.OPEN_READWRITE);
    const statement = `DELETE FROM images WHERE id=?`;

    db.run(statement, [id], (err) => {
        if(err){
            res.status(500).json({message: `Database error. ${err}`});
            return;
        }
    });

    db.close();

    res.status(201).send();
});

router.get('/reset', async (req, res) => {
    res.set(HEADER);

    const db = new sqlite3.Database(':memory', sqlite3.OPEN_READWRITE);
    const statement = `DELETE FROM images`;

    db.run(statement, (err) => {
        if(err){
            res.status(500).json({message: `Database error. ${err}`});
            return;
        }
    });

    db.close();

    res.status(201).send();
})

setupDatabase();

app.use(express.json());
app.use(cors());
app.use('/image', router);

app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`)
});
