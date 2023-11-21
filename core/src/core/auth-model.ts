import {AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, OneToMany} from "typeorm"
import {Request} from "express";
import bcrypt from 'bcrypt';
import {Model} from "./model"
import { ShorturlService } from "./shorturl";
import { EmailMessage } from "../email";
import { SmsMessage } from "../sms";


export class AuthModel extends Model {
    @Column()
    password: string

    @Column({nullable: true, unique: true})
    email: string

    @Column({length: 10, unique: true})
    phone: string

    @Column({type: 'datetime', nullable: true})
    emailVerifiedAt: string

    @Column({type: 'datetime', nullable: true})
    phoneVerifiedAt: string

    @Column({default: false})
    isStaff: boolean

    @Column({default: false})
    isAdmin: boolean

    phoneVerified: boolean

    emailVerified: boolean

    name: string

    hidden: (keyof this)[] = [
        'password',
        'emailVerifiedAt',
        'phoneVerifiedAt'
    ]

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword() {
        this.password = this.password
            ? await bcrypt.hash(this.password, 10)
            : this.password;
    }

    @AfterLoad()
    async checkVerification() {
        this.emailVerified = !!this.emailVerifiedAt
        this.phoneVerified = !!this.phoneVerifiedAt
    }

    async checkPassword(password: string) {
        return await bcrypt.compare(password, this.password)
    }

    async verifyEmail() {
        this.emailVerifiedAt = new Date().toISOString()
        await this.save()
    }

    async verifyPhone() {
        this.phoneVerifiedAt = new Date().toISOString()
        await this.save()
    }

    async sendEmailVerificationNotification(req: Request) {
        const url = (await (new ShorturlService)
            .shorten(req.sign('verify/email/confirm', {id: this.id}, '1h')))
            .url(req);

        await (new EmailMessage)
            .to(this.email || '')
            .subject('Email Verification')
            .greeting('Hello,' + this.name)
            .line('Please click the button below to verify your email address.')
            .action('Verify Email', url)
            .footer('If you did not sign up for this service, please ignore this email.')
            .send()
    }

    sendSms(){
        return (new SmsMessage).to(this.phone)
    }

    sendEmail(){
        return (new EmailMessage).to(this.email)
    }

    async sendPhoneVerificationNotification(req: Request) {
        const url = (await (new ShorturlService)
            .shorten(req.sign('verify/phone/confirm', {id: this.id}, '1h')))
            .url(req);

        await (new SmsMessage)
            .to(this.phone)
            .line('Hello, please verify your phone number by clicking the link below.')
            .link(url)
            .send();
    }

    async sendPasswordResetNotification(req: Request) {
        const url = (await (new ShorturlService)
            .shorten(
                req.sign('password/reset', {id: this.id, email: this.email}, '1h')
            )).url(req);

        await (new EmailMessage)
            .to(this.email)
            .subject('Password Reset')
            .greeting('Hello,' + this.name)
            .line('Please click the button below to change your password.')
            .action('Change Password', url)
            .footer('If you did not request password change, please ignore this email.')
            .send()
    }

    async sendPasswordResetNotificationByPhone(req: Request) {
        const url = (await (new ShorturlService)
            .shorten(
                req.sign('password/reset', {id: this.id, email: this.email}, '1h')
            )).url(req);

        await (new SmsMessage)
            .to(this.phone)
            .line('Hello, please change your password by clicking the link below.')
            .link(url)
            .send();
    }
}