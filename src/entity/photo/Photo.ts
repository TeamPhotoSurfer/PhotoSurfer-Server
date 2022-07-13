import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Status } from "../Status";
import { User } from "../user/User";

@Entity()
export class Photo extends CommonEntity{
    
    @Column()
    imageURL: string;

    @ManyToOne(
        () => User,
        user => user.photos, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'user_id'
    })
    userId: Long;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: string;
}

