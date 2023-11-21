import {template} from "./builder";
import {EmailService} from "./service";
import hbs from "hbs";

export class EmailMessage{
    private _to: string = '';
    private _subject: string = '';
    private body: string = ''
    private _greeting: string='';
    private _footer: string = `<tr></tr>`;

    to(email: string): this {
        this._to = email;
        return this;
    }

    footer(text: string) {
        this._footer += `
         <tr>
          <td class="content-block">
            <span class="apple-link">${text}</span>
          </td>
        </tr>
        `
        return this;
    }

    line(text: string) {
        this.body += `<p>${text}</p>`
        return this;
    }

    action(text: string, url: string) {
        this.body += `
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
              <tbody>
                <tr>
                  <td align="left">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <td> <a href="${url}" target="_blank">${text}</a> </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>`
        return this;
    }

    greeting(text: string) {
        this._greeting = text;
        return this;
    }

    subject(text: string) {
        this._subject = text;
        return this;
    }

    async send(): Promise<void> {
        await (new EmailService).send({
            to: this._to,
            subject: this._subject,
            html: this.build()
        });
    }

    private build() {
        const _template = hbs.handlebars.compile(template);
        const data = {
            subject: this._subject,
            body: `<p>${this._greeting}</p>` + this.body,
            footer: this._footer
        }

        return _template(data)
    }
}