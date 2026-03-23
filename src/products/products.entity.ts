/* eslint-disable prettier/prettier */
import { Review } from 'src/reviews/reviews.entity';
import { User } from 'src/users/users.entity';
import { CURRANT_TIMESTAMP } from 'src/utils/constants';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ type: 'varchar', length: 150 })
    title: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @CreateDateColumn({ type: 'timestamp', default: () => CURRANT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => CURRANT_TIMESTAMP, onUpdate: CURRANT_TIMESTAMP })
    updatedAt: Date;


    @OneToMany(() => Review, (reviews) => reviews.product)
    reviews: Review[];


    @ManyToOne(() => User, (user) => user.products)

    user: User;
}