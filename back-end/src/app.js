
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
const parser = bodyParser.urlencoded({ extended: true });

app.use(parser);
app.use(express.json());
app.use(cors());
app.use("/api", require('./routes'))

export {app};