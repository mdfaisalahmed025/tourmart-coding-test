import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';
import { Role } from '../roles.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    contactNumber: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role; // Update this to reflect the role as a single enum value

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];
}








