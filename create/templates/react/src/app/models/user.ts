import {AfterLoad, Column, Entity} from "typeorm"
import {AuthModel} from "@skullium/core"


@Entity()
export class User extends AuthModel {
    @Column({type: 'varchar', unique: true, length: 13})
    username: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    // @AfterLoad()
    // async checkVerification() {
    //     this.name = `${this.firstName} ${this.lastName}`
    // }
}