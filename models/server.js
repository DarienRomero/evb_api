const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            authPath: '/api/auth',
            usuariosPath: '/api/usuarios',
        }
        //Conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas de mi aplicación
        this.routes();
    }
    async conectarDB() {
        await dbConnection();
    }
    middlewares() {
        //CORS
        this.app.use(cors());
        //Parseo y lectura del body
        this.app.use(express.json());
        //Directorio público
        this.app.use(express.static('public'));
    }
    routes() {
        this.app.use(this.paths.authPath, require('../routes/auth'));
        this.app.use(this.paths.usuariosPath, require('../routes/usuarios'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en puerto: ", this.port);
        });
    }
}

module.exports = Server;