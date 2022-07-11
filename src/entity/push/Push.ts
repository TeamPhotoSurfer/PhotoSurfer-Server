import {Entity, PrimaryGeneratedColumn, Column, Long, ManyToOne, JoinColumn, OneToMany, OneToOne} from "typeorm";
import { CommonEntity } from "../CommonEntity";
import { Photo } from "../photo/Photo";
import { PushTag } from "../pushtag/PushTag";
import { Status } from "../Status";
import { User } from "../user/User";

@Entity()
export class Push extends CommonEntity{


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
    
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: string;

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
    }
}