
import { ApiProperty } from "@nestjs/swagger";
import { Express } from "express";
export class FileUploadDto {

  @ApiProperty({
    type: Array,
    required: true,
    name: 'file',
    items:{
      type:String,
      format:'binary'
    }

  })
  file:Array<Express.Multer.File>
}
