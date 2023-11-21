export interface DatabaseConfig {
    type: string;
    host?: string;
    port?: string | number;
    username?: string;
    database: string;
    password?: string;
    synchronize?: boolean;
    logging?: boolean;
    entities?: any[];
    migrations?: any[];
    subscribers?: any[];
}

