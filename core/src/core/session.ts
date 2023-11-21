import {TypeormStore} from "connect-typeorm";
import ExpressSession from "express-session";
import {database} from "../database";
import {Session} from "../models/session";

export function session() {
    return ExpressSession({
        resave: false,
        saveUninitialized: false,
        store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false, // If using MariaDB.
            ttl: 86400
        }).connect(database.getRepository(Session)),
        secret: process.env.SESSION_SECRET || "skullfromciyane",
        name: "abbeys",
        cookie: {
            maxAge: 86400000,
            secure: process.env.NODE_ENV === "production",
            sameSite: true,
            httpOnly: true,
        },
    })
}