import {Entity, PrimaryGeneratedColumn, Column, Long, OneToMany} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Photo } from "../photo/Photo";
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

    @Column()
    isDeleted: boolean;

    @OneToMany(
        () => Photo,
        photo => photo.user, { cascade: true }
    )
    photos: Photo[];

    @OneToMany(
        () => Tag,
        tag => tag.user
    )
    tags: Tag[];

    constructor(name: string, email:string, socialType:SocialType, fcmToken:string, push:boolean){
        super();
        this.name = name;
        this.email = email;
        this.socialType = socialType;
        this.fcmToken = fcmToken;
        this.push = push;
    }
}