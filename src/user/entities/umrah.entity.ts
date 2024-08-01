import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./booking.entity";

@Entity()
export class UmrahPackage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    packageName: string

    @Column()
    totalDuration: string

    @Column()
    price: number;

    @OneToMany(() => Booking, (booking) => booking.umrahPackage)
    bookings: Booking[];
}
