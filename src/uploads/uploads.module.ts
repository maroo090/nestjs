/* eslint-disable prettier/prettier */
import { BadRequestException, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { UploadsController } from "./uplaods.controller";
import { diskStorage } from "multer";

@Module({
    controllers: [UploadsController],
    imports: [MulterModule.register({
        storage: diskStorage({
            destination: './images',
            filename: (req, file, cb) => {
                const prefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
                const filename = `${prefix}-${file.originalname}`
                cb(null, filename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image'))
                cb(null, true)
            else
                cb(new BadRequestException("unopposed file type "), false)
        },
        limits: {
            fileSize: 1024 * 1024 * 5
        }// */ 5 megabytes
    })]
})
export class UploadsModule {

}