/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadsController } from "./uplaods.controller";

@Module({
    controllers: [UploadsController],
    imports: [MulterModule.register()]
})
export class UploadsModule {

}