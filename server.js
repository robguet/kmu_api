const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');


class Server {
    constructor() {
        this.app = express();
        this.port = 4000;

        //?CONNECT DB
        this.dbConnection();

        //?HTTP SERVER
        this.server = http.createServer(this.app);
    }

    execute() {
        //?INIT MIDDLEWARES
        this.middlewares();
    }

    async dbConnection() {
        const connection = mysql.createConnection({
            host: 'bvzviiphehcohyml5sxm-mysql.services.clever-cloud.com',
            user: 'u6r8rbnbfdqhaluw',
            password: 'UngNk0XXjM7bNggibADG',
            database: 'bvzviiphehcohyml5sxm',
            multipleStatements: true
        });
        connection.connect((err) => {
            if (err) throw err;
            console.log('Connected!');
        });

        module.exports = {
            connection
        }
    }

    middlewares() {
        // this.app.use(express.static(path.resolve(__dirname, '../public')));

        this.app.use(cors());

        this.app.use(express.json());


        this.app.get('/', (req, res) => {
            res.send('Hola Mundo');
        });
        this.app.use('/aut', require('./routes/aut'));
        this.app.use('/charges', require('./routes/charges'));

        //?INIT SERVER
        this.app.listen(4000, '0.0.0.0', () => {
            console.log('corriendo servidor', this.port);
        });

    }
}

module.exports = Server;