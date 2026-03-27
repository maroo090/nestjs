/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CURRANT_TIMESTAMP } from 'src/utils/constants';
import { Product } from 'src/products/products.entity';
import { Review } from 'src/reviews/reviews.entity';
import { UserEnum } from 'src/utils/enums';
import { Exclude } from 'class-transformer';

/**
 * User entity representing a user in the database
 * @property id - Unique identifier
 * @property username - User's display name (optional)
 * @property email - User's unique email address
 * @property password - Hashed password
 * @property userType - Role type (ADMIN or USER)
 * @property isAccountVerified - Whether account is verified
 * @property createdAt - Account creation timestamp
 * @property updatedAt - Last update timestamp
 * @property products - Products created by this user
 * @property reviews - Reviews written by this user
 */
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

  @Column({ type: 'enum', enum: UserEnum, default: UserEnum.USER })
  userType: string;

  @Column({ type: 'boolean', default: false })
  isAccountVerified: boolean;

  @Column({ type: 'timestamp', default: () => CURRANT_TIMESTAMP })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => CURRANT_TIMESTAMP,
    onUpdate: CURRANT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
