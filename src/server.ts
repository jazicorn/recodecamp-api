'use strict';
/* eslint-disable  @typescript-eslint/no-explicit-any */
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
const { CORS_URL1, DATABASE_URL, DATABASE_ENV } = process.env;

if( DATABASE_ENV === "Production") {
    console.log(`---\n🔄 Production Server Loading...\n---`);
} else if( DATABASE_ENV === "Staging") {
    console.log(`---\n🔄 Staging Server Loading...\n---`);
} else {
    console.log(`---\n🔄 Development Server Loading...\n---`);
}

class App {
    public app: Application;
    public port: number;
    private corsOptions;

    constructor(authControllers, controllers) {
        this.corsOptions = CORS_URL1;
        this.app = express();
        this.port = parseInt(process.env.PORT as string) || 8000;
        this.initMiddlewares();
        this.initAuthControllers(authControllers);
        this.initControllers(controllers);
    }

    private initMiddlewares() {
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(cors({
            credentials: true,
            origin: this.corsOptions
        }));
        this.app.use( (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            next();
        });
        this.app.options("/", (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.sendStatus(204);
        });
        // this.app.set('trust proxy', 1) // trust first proxy
        // this.app.use(session({
        //     secret: process.env.SECRET_TOKEN,
        //     saveUninitialized:true,
        //     cookie: { sameSite: 'strict', secure: false, maxAge: 1000 * 60 * 60 * 24 },
        //     resave: false
        // }));
    }

    private initAuthControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/auth', controller.router);
        });
    }

    private initControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, "0.0.0.0", (): void => {
            if( DATABASE_ENV === "Production") {
                console.log(
                    `🏃🏿‍♀️ Production Server Running Here 👉 http://localhost:${this.port}\n---`
                );
            } else if( DATABASE_ENV === "Staging") {
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
