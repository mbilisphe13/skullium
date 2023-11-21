import axios from 'axios';

export class SmsMessage {
    private content: string = '';
    private _phone: string = '';

    to(phone: string): SmsMessage {
        this._phone = phone;
        return this;

    }

    async send(): Promise<void> {
         await axios.post(process.env.SMS_API_HOST||'', {
            type: 'transactional',
            unicodeEnabled: false,
            sender: process.env.SMS_API_SENDER,
            recipient: '27' + this._phone.replace(/^0+/, ''), // Trim leading zeros
            content: this.content,
        }, {
            headers: {
                'api-key': process.env.SMS_API_KEY,
            }
        });
    }

    public line(text: string): SmsMessage {
        this.content += text + '\n';
        return this;
    }

    public link(url: string, text: string | null = null): SmsMessage {
        if (text) {
            this.content += `${text}: ${url}\n`;
        } else {
            this.content += `${url}\n`;
        }
        return this;
    }
}
