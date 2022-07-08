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

    @ManyToOne(
        () => Photo, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'photo_id'
    })
    photo: Photo;

    @OneToMany(
        () => PushTag,
        pushtag => pushtag.push, { cascade: true }
    )
    pushTags: PushTag[];
    
    @Column()
    pushDate: Date;
    
    @Column({default: false})
    isDeleted: boolean;

    addPushTag (pushTag: PushTag) {
        if(this.pushTags == null){
            this.pushTags = [];
        }
        this.pushTags.push(pushTag);
        pushTag.setPush(this);
    }

    constructor(memo: string, user:User, photo:Photo, pushDate: Date){
        super();
        this.memo = memo;
        this.user = user;
        this.photo = photo;
        this.pushDate = pushDate;
        this.isDeleted = false;
    }
}