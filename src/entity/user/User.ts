import {Entity, PrimaryGeneratedColumn, Column, Long, OneToMany} from "typeorm";
import { DateEntity } from "../DateEntity";
import { Photo } from "../photo/Photo";
import { Tag } from "../tag/Tag";
import { SocialType } from "./SocialType";

@Entity()
export class User extends DateEntity{

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
}