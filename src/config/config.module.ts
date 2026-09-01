import { Global, Module } from '@nestjs/common';
import { AppConfig, configValue } from './app-config';

@Global()
@Module({
    providers: [
        {
            provide: AppConfig,
            useValue: configValue,
        },
    ],
    exports: [AppConfig],
})
export class AppConfigModule { }