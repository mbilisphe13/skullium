import {Column, Entity} from 'typeorm';
import {Model} from "../core/model";

@Entity()
export class Shorturl extends Model {

    @Column()
    original: string;

    @Column({unique: true})
    short: string;
}
