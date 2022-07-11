import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Photo } from "../photo/Photo";
import { Push } from "../push/Push";
import { Status } from "../Status";
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
    tagId: Long;

    @ManyToOne(
        () => Push, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'push_id'
    })
    pushId: Long;
    
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: string;

    // setPush (push: Push) {
    //     this.push = push;
    // }

    constructor(tagId: Long, pushId: Long){
        super();
        this.tagId = tagId;
        this.pushId = pushId;
    }
}