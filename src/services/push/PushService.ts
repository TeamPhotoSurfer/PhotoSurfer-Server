import { getRepository } from "typeorm";
import { Photo } from "../../entity/photo/Photo";
import { Push } from "../../entity/push/Push";
import { PushTag } from "../../entity/pushtag/PushTag";
import { Tag } from "../../entity/tag/Tag";
import { User } from "../../entity/user/User";
import { PushCreateRequest } from "../../interfaces/push/request/PushCreateRequest";
import connect from "../../loaders/db"
const mysql = require("mysql");

const createPush = async (pushCreateRequest: PushCreateRequest) => {
  const userRepository = getRepository(User);
  const photoRepository = getRepository(Photo);
  const tagRepository = getRepository(Tag);
  const pushRepository = getRepository(Push);

  try {
    //방법1
    const user = await userRepository //TODO : null 확인 필요
      .createQueryBuilder("user")
      .where("user.id = :id", { id: pushCreateRequest.userId })
      .getOne();
    //방법2
    const user2 = await userRepository.find({
      id: pushCreateRequest.userId,
    });

const createPush = async(pushCreateRequest: PushCreateRequest) => {
    const userRepository = getRepository(User);
    const photoRepository = getRepository(Photo);
    const tagRepository = getRepository(Tag);
    const pushRepository = getRepository(Push);
    const pushTagRepository = getRepository(PushTag);

    try{
        //방법1
        const user = await userRepository//TODO : null 확인 필요
                    .createQueryBuilder("user")
                    .where("user.id = :id", {id : pushCreateRequest.userId})
                    .getOne();

        userRepository.createQueryBuilder("user")
        
        //방법2
        const user2 = await userRepository
                    .find({
                        id: pushCreateRequest.userId
                    });
        
        const photo = await photoRepository //TODO : null 확인
                    .createQueryBuilder("photo")
                    .where("photo.id = :id", {id : pushCreateRequest.photoId})
                    .getOne();
        
        const push = new Push( //Push 객체 생성
            pushCreateRequest.memo,
            pushCreateRequest.userId,
            pushCreateRequest.photoId,
            pushCreateRequest.pushDate
        );
        await pushRepository.save(push); //DB에 저장 (insert 어쩌구 대신 이거 써도 됨)

        let tagList: Tag[] = await tagRepository //얘는 사실 비즈니스 적으로 여기서 필요없는데 내가 잘못 작성함, 하지만 whereInIds 예시
                            .createQueryBuilder("tag")
                            .whereInIds(pushCreateRequest.tagIds) //여러개의 id들이 포함되어 있는 결과 값 내놔
                            .getMany();
        
        let pushTagList: PushTag[] = []; //Push에 저장할 태그 배열 생성
        for(let i=0; i < pushCreateRequest.tagIds.length; i++){
            pushTagList.push(new PushTag(pushCreateRequest.tagIds[i], push.id));
        }

        await pushTagRepository //TODO : null 확인
                    .createQueryBuilder("pushTag")
                    .insert()
                    .into(PushTag)
                    .values(pushTagList) //PushTag 배열 한 번에 다 insert해버리기
                    .execute();
        
        const data = {
            id: push.id
        };
        return data;

    //push에 pushTag 넣기
    for (const idx in pushTagList) {
      push.addPushTag(pushTagList[idx]);
    }

    await pushRepository.save(push);

    const data = {
      id: push.id,
    };
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const test = async () => {
  try {
    let connection = mysql.createConnection(connect);
    connection.connect(); // connect database

    const testQuery = "select * from `user`";
    console.log(testQuery);
    
    connection.query(testQuery, (error:any, result:any, field:any) => {
        console.log(result);
        
        if (error) {
            console.log("Error Execution :", error);
        }
        return result;
    });
    connection.end(); // de-connect database
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createPush,
  test,
};
