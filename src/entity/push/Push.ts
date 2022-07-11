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
    userId: Long;

    @ManyToOne(
        () => Photo, { onDelete: "CASCADE",orphanedRowAction: "delete" }
    )
    @JoinColumn({
        name: 'photo_id'
    })
    photoId: Long;

    @OneToMany(
        () => PushTag,
        pushtag => pushtag.pushId, { cascade: true }
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

    // addPushTag (pushTag: PushTag) {
    //     if(this.pushTags == null){
    //         this.pushTags = [];
    //     }
    //     this.pushTags.push(pushTag);
    //     pushTag.setPush(this);
    // }

    constructor(memo: string, userId:Long, photoId:Long, pushDate: Date){
        super();
        this.memo = memo;
        this.userId = userId;
        this.photoId = photoId;
        this.pushDate = pushDate;
    }
}