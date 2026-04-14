/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mail.service";
@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {

                const host = config.get<string>('SMTP_HOST') ?? '';
                const port = config.get<number>('SMTP_PORT') ?? 587;
                const user = config.get<string>('SMTP_USERNAME') ?? '';
                const pass = config.get<string>('SMTP_PASSWORD') ?? '';

                console.log('SMTP CONFIG 👉');
                console.log({ host, port, user, pass });
                return {
                    transport: {
                        host,
                        port,
                        secure: false,
                        auth: {
                            user,
                            pass
                        },
                        connectionTimeout: 5000
                    }, defaults: {
                        from: `"No Reply" <${user}>`,
                    },
                }
            }
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {

}