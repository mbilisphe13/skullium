import { sqliteDatabase } from "./sqlite";
import { mysqlDatabase } from "./mysql";
import { DatabaseConfig } from "./type";
import { Shorturl } from "../models/shorturl";
import { Session } from "express-session";

const databaseConfig : DatabaseConfig = {
    type: process.env.DATABASE_DRIVER || 'sqlite',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    database: process.env.DATABASE||'database.db',
    password: process.env.DATABASE_PASSWORD || '',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || false,
    logging: process.env.DATABASE_LOGGING === 'true' || false,
    entities: [Shorturl, Session,
        ...(process.env.DATABASE_ENTITIES?.split(',') || []),
      ],
      migrations: [
        ...(process.env.DATABASE_MIGRATIONS?.split(',') || []),
      ],
      subscribers: [
        ...(process.env.DATABASE_SUBSCRIBERS?.split(',') || []),
      ],
}


export const database = databaseConfig.type === "sqlite" 
? sqliteDatabase(databaseConfig) 
: mysqlDatabase(databaseConfig)