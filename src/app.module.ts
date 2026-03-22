import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.modules';
import { ProductModule } from './products/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
    UsersModule,
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'moawed2005',
      database: 'hotel_db',
      autoLoadEntities: true,
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
  ],
  // exports: [],
  // providers: [],
  // controllers: [],
})
export class AppModule {
  constructor() {
    console.log('Database Host:', process.env.HOST);
  }
}
