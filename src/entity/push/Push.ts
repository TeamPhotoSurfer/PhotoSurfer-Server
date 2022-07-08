import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany, OneToOne} from "typeorm";
import { DateEntity } from "../DateEntity";
import { Photo } from "../photo/Photo";
import { Tag } from "../tag/Tag";
import { User } from "../user/User";

@Entity()
export class Push extends DateEntity{
    

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