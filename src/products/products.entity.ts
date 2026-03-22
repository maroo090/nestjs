/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: 'varchar', length: 150})
    title: string;
    @Column()
    price: number;
    @Column()
    description: string;
    @CreateDateColumn({ type: 'timestamp', default: ()=>'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt: Date;

}