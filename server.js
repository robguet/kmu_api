const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');


class Server {
    constructor() {
        this.app = express();
        this.port = 8080;

        //conectar db
        this.dbConnection();

        //http server
        this.server = http.createServer(this.app);
    }

    execute() {
        //init server
        this.server.listen(this.port, () => {
            console.log('corriendo servidor');
        });
        // init middlewares
        this.middlewares();
    }

    async dbConnection() {
        const connection = mysql.createConnection({
            host: 'sql3.freesqldatabase.com',
            user: 'sql3476904',
            password: 'kY31N971MR',
            database: 'sql3476904',
            multipleStatements: true
        });
        connection.connect((err) => {
            if (err) throw err;
            console.log('Connected!');
        });

        // connection.end((err) => {

        // });

        module.exports = {
            connection
        }
    }

    middlewares() {
        // this.app.use(express.static(path.resolve(__dirname, '../public')));

        this.app.use(cors());

        this.app.use(express.json());

        this.app.use('/aut', require('./routes/aut'));
        this.app.use('/charges', require('./routes/charges'));


    }
}

module.exports = Server;