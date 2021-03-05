import express  from "express";
import multer from 'multer';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import { check, validationResult, param } from 'express-validator';
import path from "path";
const upload = multer({ dest: '../uploads/' }); // Pour les données form-data et multipart form data

const app = express();
const DIR = process.cwd();
const PUB = path.join(DIR, '/public');
console.log( DIR );
console.log( PUB );

app.use('/static', express.static( PUB ) );
app.use( express.urlencoded({ extended: true }) );

// Process CLI
const optionDefinitions: OptionDefinition[] = [
    { name: 'port', alias: 'p', type: Number },
];
const options = commandLineArgs(optionDefinitions)

// Define HTTP API
app.get('/api/addition', upload.none(), [check('a').isNumeric(), check('b').isNumeric()], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const a = +req.body.a;
        const b = +req.body.b;
        res.status(200).send( `${a + b}` );
    } else {
        res.status(422).json({ errors: errors.array()});
    }
});

//Define HTTP Proxy
app.get('/proxy', upload.none(), [check('url').isText(), (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        console.log("on veut", req.body.url);
        res.status(200).send( `WIP` );
    } else {
        res.status(422).json({ errors: errors.array()});
    }
});


app.post('/api/upload', upload.none() );

app.get('/', (req, res) => {
    res.send('Hello World!');
});


// Start HTTP serveur
const port = options.port ?? 3000;
app.listen(port, () => {
    console.log(`HTTP server listening at http://localhost:${port}`);
});
