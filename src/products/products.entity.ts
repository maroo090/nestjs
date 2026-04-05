/* eslint-disable prettier/prettier */
import { Review } from 'src/reviews/reviews.entity';
import { User } from 'src/users/users.entity';
import { CURRANT_TIMESTAMP } from 'src/utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Product entity representing a product in the database
 * @property id - Unique identifier
 * @property title - Product name
 * @property price - Product price
 * @property description - Product description
 * @property createdAt - Creation timestamp
 * @property updatedAt - Last update timestamp
 * @property reviews - Reviews associated with this product
 * @property user - User who created this product
 */
@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column()
  price!: number;

  @Column()
  description!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRANT_TIMESTAMP })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRANT_TIMESTAMP,
    onUpdate: CURRANT_TIMESTAMP,
  })
  updatedAt!: Date;

  @OneToMany(() => Review, (reviews) => reviews.product)
  reviews!: Review[];
  // **if i want to add review when i fetch the product globally  **{eager:true}**
  @ManyToOne(() => User, (user) => user.products)
  //** */ if i want to add user when i fetch the product  globally**{eager:true}**

  user!: User;
}
