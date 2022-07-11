import { getRepository } from "typeorm";
import { Photo } from "../../entity/photo/Photo";
import { Push } from "../../entity/push/Push";
import { PushTag } from "../../entity/pushtag/PushTag";
import { Tag } from "../../entity/tag/Tag";
import { User } from "../../entity/user/User";
import { PushCreateRequest } from "../../interfaces/push/request/PushCreateRequest";



const createPush = async(pushCreateRequest: PushCreateRequest) => {
    const userRepository = getRepository(User);
    const photoRepository = getRepository(Photo);
    const tagRepository = getRepository(Tag);
    const pushRepository = getRepository(Push);

    try{
        //방법1
        const user = await userRepository//TODO : null 확인 필요
                    .createQueryBuilder("user")
                    .where("user.id = :id", {id : pushCreateRequest.userId})
                    .getOne();
        //방법2
        // const user2 = await userRepository 
        //             .find({
        //                 id: pushCreateRequest.userId
        //             });
        
        const photo = await photoRepository //TODO : null 확인
                    .createQueryBuilder("photo")
                    .where("photo.id = :id", {id : pushCreateRequest.photoId})
                    .getOne();
        
        const push = new Push(
            pushCreateRequest.memo,
            user!,
            photo!,
            pushCreateRequest.pushDate
        );

        let tagList: Tag[] = await tagRepository
                            .createQueryBuilder("tag")
                            .whereInIds(pushCreateRequest.tagIds)
                            .getMany();
        
        let pushTagList: PushTag[] = [];
        for(let i=0; i < tagList.length; i++){
            pushTagList.push(new PushTag(tagList[i], push));
        }
        
        //push에 pushTag 넣기
        for(const idx in pushTagList){
            push.addPushTag(pushTagList[idx]);
        }
        
        await pushRepository.save(push); 

        const data = {
            id: push.id
        };
        return data;

    }catch(error){
        console.log(error);
        throw error;
    }
}

export default {
    createPush
}