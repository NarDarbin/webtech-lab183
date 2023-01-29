const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const PORT = 8000;
const app = express();
const router = express.Router();

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
    const { image, author, tags, description, alt } = req.body;

    const db = new sqlite3.Database(':memory');
    const statement = `INSERT INTO images (image, author, tags, description, alt) VALUES (?, ?, ?, ?, ?)`;

    db.run(statement, [image, author, tags, description, alt]);

    db.close();

    res.status(201).send();
});

router.get('/', async (req, res) => {
    const db = new sqlite3.Database(':memory');
    const statement = `SELECT id, image, author, tags, description, alt FROM images`;

    db.all(statement, (err, rows) => {
        if (err) {
            throw err;
        }

        res.status(200).json(rows);
    });

    db.close();
});

router.put('/', async (req, res) => {
    
});

router.delete('/', async (req, res) => {
    
});

setupDatabase();

app.use(express.json());
app.use(cors());
app.use('/image', router);

app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`)
});
