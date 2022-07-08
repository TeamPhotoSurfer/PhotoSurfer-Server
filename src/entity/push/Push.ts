import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany, OneToOne} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Photo } from "../photo/Photo";
import { PushTag } from "../pushtag/PushTag";
import { User } from "../user/User";

@Entity()
export class Push extends CommonEntity{


    @Column()
    memo: string;

    @ManyToOne(
        () => User,
        user => user.push, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'user_id'
    })
    user: User

    @OneToOne(
        () => Photo, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn()
    photo: Photo;
    
    @Column()
    pushDate: Date;
}