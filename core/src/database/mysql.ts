import {DataSource} from "typeorm"
import { DatabaseConfig } from "./type"



export const mysqlDatabase =  (configs: DatabaseConfig)  => new DataSource({
     "type":  "mysql",
        "host": configs.host || "localhost",
        "port": parseInt(configs.port?.toString() || '3306'),
        "username": configs.username || "root",
        "database": configs.database || "express",
        "password": configs.password || "",
        "synchronize": true,
        "logging": false,
        "entities": ["src/server/models/**/*.ts", "src/#skull/models/**/*.ts"],
        "migrations": ["src/app/migrations/**/*.ts"],
        "subscribers": ["src/app/subscribers/**/*.ts"]
})
