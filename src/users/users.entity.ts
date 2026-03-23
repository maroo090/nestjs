/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CURRANT_TIMESTAMP } from 'src/utils/constants';
import { Product } from 'src/products/products.entity';
import { Review } from 'src/reviews/reviews.entity';
import { UserType } from 'src/utils/enums';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ type: 'varchar', length: 150, nullable: true })
    username: string;


    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;
    @Column()
    @Exclude()
    password: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.USER })
    userType: string


    @Column({ type: 'boolean', default: false })
    isAccountVerified: boolean;

    @Column({ type: 'timestamp', default: () => CURRANT_TIMESTAMP })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => CURRANT_TIMESTAMP,
        onUpdate: CURRANT_TIMESTAMP
    })
    updatedAt: Date;


    @OneToMany(() => Product, (product) => product.user)
    products: Product[]

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[]
}
