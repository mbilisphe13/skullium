import {Request} from "express";
import {Shorturl as ShortUrlModel} from "../models/shorturl";
import {database} from "../database";


const Shorturl = database.getRepository(ShortUrlModel);

export class ShorturlService {

    short: string;

    async shorten(original: string): Promise<this> {
        const existing = await Shorturl.findOneBy({original});

        if (existing) {
            this.short = existing.short;
        }

        const short = await this.generateShortUrl();

        await Shorturl.create({original, short}).save();

        this.short = short;

        return this
    }

    plain(): string {
        return this.short;
    }

    url(req: Request): string {
        return `${req.protocol}://${req.get('host')}/s/${this.short}`;
    }

    async resolve(short: string): Promise<string | null> {
        const urlEntry = await Shorturl.findOneBy({short});

        if (urlEntry) {
            return '/' + urlEntry.original;
        }

        return null;
    }

    private async generateShortUrl(): Promise<string> {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const shortUrlLength = 8;
        let shortUrl = '';

        while (shortUrl.length < shortUrlLength) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            const randomChar = characters.charAt(randomIndex);
            shortUrl += randomChar;
        }

        // Check if the generated short URL is unique
        return (await this.isShortUrlUnique(shortUrl)) ? shortUrl : this.generateShortUrl();
    }

    private async isShortUrlUnique(short: string): Promise<boolean> {
        const existingUrl = await Shorturl.findOneBy({short});
        return !existingUrl;
    }
}