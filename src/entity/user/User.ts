import {Entity, PrimaryGeneratedColumn, Column, Long, OneToMany} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Photo } from "../photo/Photo";
import { Status } from "../Status";
import { Tag } from "../tag/Tag";
import { SocialType } from "./SocialType";

@Entity()
export class User extends CommonEntity{

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: SocialType
    })
    socialType: string;

    @Column()
    fcmToken: string;

    @Column()
    push: boolean;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: string;

    @OneToMany(
        () => Photo,
        photo => photo.userId, { cascade: true }
    )
    photos: Photo[];

    @OneToMany(
        () => Tag,
        tag => tag.userId
    )
    tags: Tag[];

    constructor(name: string, email:string, socialType:SocialType, fcmToken:string, push:boolean, isDeleted:boolean){
        super();
        this.name = name;
        this.email = email;
        this.socialType = socialType;
        this.fcmToken = fcmToken;
        this.push = push;
    }
}