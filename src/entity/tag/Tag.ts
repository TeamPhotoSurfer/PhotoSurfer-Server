import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Photo } from "../photo/Photo";
import { Status } from "../Status";
import { User } from "../user/User";
import { BookmarkStatus } from "./BookmarkStatus";
import { TagType } from "./TagType";

@Entity()
export class Tag extends CommonEntity{
    
    @Column()
    name: string;

    @ManyToOne(
        () => User,
        user => user.tags, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'user_id'
    })
    user: User

    @Column({
        type: 'enum',
        enum: TagType
    })
    tagType: TagType;

    @Column({type: 'bigint'})
    addCount: Long;

    @Column({type: 'bigint'})
    searchCount: Long;

    @Column({
        type: 'enum',
        enum: BookmarkStatus,
        default: BookmarkStatus.ACTIVE
    })
    bookmarkStatus: string;
    
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: string;
}