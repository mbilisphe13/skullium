/// <reference types="vite/client" />

import { AxiosInstance } from 'axios';
import ziggyRoute, { Config as ZiggyConfig } from 'ziggy-js';

declare global {

    export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
        auth: {
            user?: {
                id: number;
                name: string;
                email: string
                emailVerified: boolean,
                phone: string
                phoneVerified: boolean
            }
        };
    };

    type Page = JSX.Element

    interface Window {
        axios: AxiosInstance;
    }

    var route: typeof ziggyRoute;
    var Ziggy: ZiggyConfig;
}
