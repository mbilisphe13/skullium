
import { User as UserClass } from "../src/app/models/user";
import  {Model as ModelClass} from "@skull/core";

export {};

declare global {
    interface User extends UserClass{}

    interface  Model extends ModelClass{}

    interface JwtPayload {
        userId: number;
    }
}