import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { UmrahPackage } from "./umrah.entity";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    username:string

    @ManyToOne(() => User, (user) => user.bookings)
    user: User;
    @ManyToOne(() => UmrahPackage, (umrahPackage) => umrahPackage.bookings)
    umrahPackage: UmrahPackage;
}