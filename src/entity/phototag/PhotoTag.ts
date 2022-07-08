import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { DateEntity } from "../DateEntity";
import { Photo } from "../photo/Photo";
import { Tag } from "../tag/Tag";
import { User } from "../user/User";

@Entity()
export class PhotoTag extends DateEntity{
    
    @ManyToOne(
        () => Tag,
        {
            onDelete: "CASCADE",
            orphanedRowAction: "delete"
        }
    )
    @JoinColumn({
        name: 'tag_id'
    })
    tag: Tag

    @ManyToOne(
        () => Photo,
        {
            onDelete: "CASCADE",
            orphanedRowAction: "delete"
        }
    )
    @JoinColumn({
        name: 'photo_id'
    })
    photo: Photo
    
    @Column()
    isDeleted: boolean;
}