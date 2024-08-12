import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./entities/user.entity";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @ManyToOne(() => User, (user) => user.tokens)
    user: User;

    @Column()
    expiresAt: Date;
}