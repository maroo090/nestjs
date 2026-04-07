/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../products/products.entity';
import { CURRANT_TIMESTAMP } from 'src/utils/constants';
import { User } from 'src/users/users.entity';
/**
 * Review entity representing a product review in the database
 * @property id - Unique identifier
 * @property comment - Review text
 * @property rating - Rating value (1-5)
 * @property createdAt - Creation timestamp
 * @property updatedAt - Last update timestamp
 * @property product - Associated product
 * @property user - User who wrote the review
 */
@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'varchar', length: 150 })
  comment!: string;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'timestamp', default: () => CURRANT_TIMESTAMP })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => CURRANT_TIMESTAMP,
    onUpdate: CURRANT_TIMESTAMP,
  })
  updatedAt!: Date;

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  product!: Product;

  @ManyToOne(() => User, (user) => user.reviews, { eager: true, onDelete: 'CASCADE' })
  user!: User;
}
