import {DataSource} from "typeorm"
import { DatabaseConfig } from "./type"



export const sqliteDatabase =  (configs: DatabaseConfig)  => new DataSource({
    "type": "sqlite",
    "database": configs.database || "database.sqlite",
    "synchronize": configs.synchronize || true,
    "logging": configs.logging || false,
    "entities": ["src/app/models/**/*.ts", "src/#skull/models/**/*.ts"],
    "migrations": ["src/app/migrations/**/*.ts"],
    "subscribers": ["src/app/subscribers/**/*.ts"]
})
