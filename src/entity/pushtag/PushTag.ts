import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Photo } from "../photo/Photo";
import { Push } from "../push/Push";
import { Tag } from "../tag/Tag";
import { User } from "../user/User";

@Entity()
export class PushTag extends CommonEntity{
    

    @ManyToOne(
        () => Tag, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'tag_id'
    })
    tag: Tag

    @ManyToOne(
        () => Push, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'push_id'
    })
    push: Push
    
    @Column()
    isDeleted: boolean;
}