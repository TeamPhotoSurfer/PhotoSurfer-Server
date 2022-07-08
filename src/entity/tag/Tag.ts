import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Photo } from "../photo/Photo";
import { User } from "../user/User";
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

    @Column()
    isBookmarked: boolean;
    
    @Column()
    isDeleted: boolean;
}