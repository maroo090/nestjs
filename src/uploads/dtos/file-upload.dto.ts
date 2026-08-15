import { ApiProperty } from '@nestjs/swagger';
export class FileUploadDto {
  @ApiProperty({
    type: Array,
    required: true,
    name: 'file',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  file: Array<Express.Multer.File>;
}
