/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { type Response, } from "express";
import { diskStorage } from 'multer'
@Controller('api/uploads')
export class UploadsController {
    @Post()
    @UseInterceptors(FileInterceptor('file', {
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
    }))
    public uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file)
            throw new BadRequestException("no file provided");
        console.log(file)
        return { message: "file uploaded successfully" }
    }
    @Get(':image')
    public showUploadedImage(@Param("image") image: string, @Res() res: Response) {
        console.log(image)
        return res.sendFile(image, { root: './images' })
    }
}