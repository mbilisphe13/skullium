import {BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {RequestHandler} from "express";

export class Model extends BaseEntity {

    hidden?: (keyof this) [] = undefined
    visible?: (keyof this) [] = undefined
    api?: boolean = undefined
    middlewares: RequestHandler[] = []


    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string

    static findById(id: number) {
        return this.findOneBy({id})
    }

    only<K extends keyof this>(...properties: K[]): Pick<this, K> {
        const result: any = {};
        for (const prop of properties) {
            if (Object.prototype.hasOwnProperty.call(this, prop)) {
                result[prop] = this[prop]!;
            }
        }
        return result as Pick<this, K>;
    }

    except<K extends keyof this>(...properties: K[]): Omit<this, K> {
        const result: any = {};
        for (const prop in this) {
            if (![...properties, 'hidden', 'visible', 'middlewares', 'api']
                .includes(prop as unknown as K)) {
                result[prop] = this[prop]!;
            }
        }
        return result as Omit<this, K>;
    }

    filter(){
        if (Array.isArray(this.hidden)) {
            return this.except(...this.hidden);
        }
        if (Array.isArray(this.visible)) {
            return this.only(...this.visible);
        }

        return this
    }
}