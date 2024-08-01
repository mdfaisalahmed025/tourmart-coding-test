import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    name: string

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    contactNumber: string;

    @Column()
    role: string; // for authorization

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];
    roles: Role[];
}


// roles.enum.ts
export enum Role {
    ADMIN = 'admin',
    USER = 'user',
    EDITOR = 'editor',
}





