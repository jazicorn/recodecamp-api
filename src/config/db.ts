// Node Postgres Docs: https://github.com/porsager/postgres
const postgres = require('postgres');
import * as dotenv from 'dotenv';

dotenv.config();
const { DATABASE_URL, DATABASE_ENV } = process.env;

const config = () => {
    try {

        if( DATABASE_ENV === "Production") {
            console.log("🗄️  Production Database \n---");
        } else if( DATABASE_ENV === "staging") {
            console.log("🗄️  Staging Database \n---");
        } else {
            console.log("🗄️  Development Database\n---");
        }

        const sql = postgres(DATABASE_URL, {ssl: 'require'});

        if( DATABASE_ENV === "development") {
            async function seedDB() {
                await sql`DROP TABLE IF EXISTS _GUEST;
                CREATE TABLE IF NOT EXISTS _GUEST(
                _ID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                _CREATED_AT DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                _UPDATED_AT DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                _ACCESS_TOKEN VARCHAR(255) NOT NULL,
                _FIRST_LOGIN BOOLEAN NOT NULL DEFAULT false,
                _ADMIN BOOLEAN NOT NULL DEFAULT false,
                _SUBSCRIPTION VARCHAR(50) NOT NULL,
                _IP_ADDRESS VARCHAR(50) NOT NULL,
                _PASSCODE UUID NOT NULL DEFAULT gen_random_uuid(),
                _PASSCODE_CONFIRMED BOOLEAN NOT NULL DEFAULT false,
                _EMAIL VARCHAR(50) UNIQUE NOT NULL,
                _EMAIL_CONFIRMED BOOLEAN NOT NULL DEFAULT false,
                _EMAIL_PASSCODE UUID NOT NULL DEFAULT gen_random_uuid(),
                _PASSWORD VARCHAR(100) NOT NULL,
                _DEFAULT_LANGUAGE VARCHAR(30) NOT NULL,
                _DEFAULT_ROUTE VARCHAR(50) NOT NULL,
                _POINTS_TOTAL INT NOT NULL,
                _POINTS_JAVASCRIPT INT NOT NULL,
                _POINTS_JAVA INT NOT NULL,
                _POINTS_PYTHON INT NOT NULL,
                _COURSES VARCHAR(255) NOT NULL);`.simple();
            }
            seedDB();
        // } else {
        //     async function seedDB() {
        //         await sql`
        //         CREATE TABLE IF NOT EXISTS _GUEST(
        //         _ID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        //         _CREATED_AT DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        //         _UPDATED_AT DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        //         _ACCESS_TOKEN VARCHAR(255) NOT NULL,
        //         _FIRST_LOGIN BOOLEAN NOT NULL DEFAULT false,
        //         _ADMIN BOOLEAN NOT NULL DEFAULT false,
        //         _SUBSCRIPTION VARCHAR(50) NOT NULL,
        //         _IP_ADDRESS VARCHAR(50) NOT NULL,
        //         _PASSCODE UUID NOT NULL DEFAULT gen_random_uuid(),
        //         _PASSCODE_CONFIRMED BOOLEAN NOT NULL DEFAULT false,
        //         _EMAIL VARCHAR(50) UNIQUE NOT NULL,
        //         _EMAIL_CONFIRMED BOOLEAN NOT NULL DEFAULT false,
        //         _EMAIL_PASSCODE UUID NOT NULL DEFAULT gen_random_uuid(),
        //         _PASSWORD VARCHAR(100) NOT NULL,
        //         _DEFAULT_LANGUAGE VARCHAR(30) NOT NULL,
        //         _DEFAULT_ROUTE VARCHAR(50) NOT NULL,
        //         _POINTS_TOTAL INT NOT NULL,
        //         _POINTS_JAVASCRIPT INT NOT NULL,
        //         _POINTS_JAVA INT NOT NULL,
        //         _POINTS_PYTHON INT NOT NULL,
        //         _COURSES VARCHAR(255) NOT NULL);`.simple();
        //     }
        //     seedDB();
        }
        return sql
    } catch(e) {
        if( DATABASE_ENV === "Production") {
            console.log("❌  Production Database \n---");
        } else if( DATABASE_ENV === "staging") {
            console.log("❌  Staging Database \n---");
        } else {
            console.log("❌  Development Database\n---");
        }
        console.log(`Database Error:\n${e}\n---\n`);
    }
}

const sql = config();

export default sql
