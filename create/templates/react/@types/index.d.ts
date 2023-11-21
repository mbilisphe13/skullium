
import { User as UserClass } from "../src/app/models/user";
import  {Model as ModelClass} from "@skullium/core";

export {};

declare global {
    interface User extends UserClass{}

    interface  Model extends ModelClass{}

    interface JwtPayload {
        userId: number;
    }
}