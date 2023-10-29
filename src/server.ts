'use strict';
/* eslint-disable  @typescript-eslint/no-explicit-any */
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
const upload = multer();
import * as dotenv from 'dotenv';
dotenv.config();
const { DATABASE_URL, DATABASE_ENV, CORS_URLS } = process.env;

if( DATABASE_ENV === "Production") {
    console.log(`---\n🔄 Production Server Loading...\n---`);
} else if( DATABASE_ENV === "staging") {
    console.log(`---\n🔄 Staging Server Loading...\n---`);
} else {
    console.log(`---\n🔄 Development Server Loading...\n---`);
}

const urlEncodedParserFalse = bodyParser.urlencoded({ extended: false });
const urlEncodedParserTrue = bodyParser.urlencoded({ extended: true });

class App {
    public app: Application;
    public port: number;

    constructor(publicControllers, authControllers, controllers) {
        this.port = parseInt(process.env.PORT as string) || 8000;
        this.app = express();
        this.initMiddlewares();
        this.initPublicControllers(publicControllers);
        this.initAuthControllers(authControllers);
        this.initControllers(controllers);
    }

    private initMiddlewares() {
        this.app.use(cors());
        // for parsing application/json
        this.app.use(bodyParser.json());
        // for parsing multipart/form-data
        this.app.use(express.static(__dirname + "/public"));
        this.app.use(express.static(__dirname + "/templates/static"));
        // for parsing cookies
        this.app.use(cookieParser());
        this.app.use( (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            next();
        });
        this.app.options('*', cors());
        // this.app.options("/", (req, res) => {
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        //     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        //     res.sendStatus(204);
        // });
    }

    private initPublicControllers(publicControllers) {
        publicControllers.forEach((controller) => {
            this.app.use('/', urlEncodedParserTrue, controller.router);
        });
    }

    private initAuthControllers(authControllers) {
        authControllers.forEach((controller) => {
            this.app.use('/api/auth', urlEncodedParserTrue, controller.router);
        });
    }

    private initControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api', urlEncodedParserTrue, controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, "0.0.0.0", (): void => {
            if( DATABASE_ENV === "Production") {
                console.log(
                    `🏃🏿‍♀️ Production Server Running Here 👉 http://localhost:${this.port}\n---`
                );
            } else if( DATABASE_ENV === "staging") {
                console.log(
                    `🏃🏿‍♀️ Staging Server Running Here 👉 http://localhost:${this.port}\n---`
                );
            } else {
                console.log(
                    `🏃🏿‍♀️ Development Server Running Here 👉 http://localhost:${this.port}\n---`
                );
            }
        });
    }
}

export default App;
