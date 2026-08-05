import { ApiProperty } from "@nestjs/swagger";
import{Express} from "express";

export class ImageUploadDto {

  @ApiProperty({
    type: String,
    required: true,
    name: 'usier-image',
    format: 'binary',

  })
  file:Express.Multer.File;
}
