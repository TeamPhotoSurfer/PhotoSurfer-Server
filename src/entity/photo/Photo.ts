import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { DateEntity } from "../DateEntity";
import { Tag } from "../tag/Tag";
import { User } from "../user/User";

@Entity()
export class Photo extends DateEntity{
    
    @Column()
    imageURL: string;

    @ManyToOne(
        () => User,
        user => user.photos, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'user_id'
    })
    user: User

    @OneToMany(
        () => Tag,
        tag => tag.photo, { cascade: true }
    )
    tags: Tag[];
    
    @Column()
    isDeleted: boolean;
}