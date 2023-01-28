const express = require('express');
const cors = require('cors');

const PORT = 8000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/image", require('./api/routes'));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
});

module.export = app;