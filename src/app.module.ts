import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.modules';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
    UsersModule,
    ReviewsModule,
  ],
  // exports: [],
  // providers: [],
  // controllers: [],
})
export class AppModule {}
