import { getConnection, getRepository, Long } from "typeorm";
import { TagInfo } from "../../interfaces/tag/TagInfo";
import { TagNameUpdateDTO } from "../../interfaces/tag/TagNameUpdateDTO";
import { TagResponseDTO } from "../../interfaces/tag/TagResponseDTO";

const getTagName = async (tagResponseDTO: TagResponseDTO)=> {
//   const tagRepository = getRepository(Tag);
  try {
    const tag = await getConnection()
      .createQueryBuilder()
      .select()
      .from(Tag, "tag")
      .where("userId=:id", { id: tagResponseDTO.userId });
      
    const tagId = await getConnection()
        .createQueryBuilder()
        .select(tagId, )
        .from()
    
    if(!tag) return null;
 
    return tag;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateTagName = async(tagId: Long, tagNameUpdateDTO: TagNameUpdateDTO, userId: Long) => {
    const tagRepository = getRepository(Tag);

    // try {
    //     //const tag = find //tag 찾아
    //     //tag null 인지 판단 -> notfound
    //     //tag 있으면 -> tag.name = tagNameUpdateDto.name;
    //     //cosnt tag = update .set(tag).where (userId = userId, tagId = tagId);
    //     const tag = await tagRepository.findByIds(tagId);
    //     if(!tag) return null;

    //     const data = await getConnection()
    //     .createQueryBuilder()
    //     .update(Tag)
    //     .set({name: tagNameUpdateDTO.name})
    //     .where("id = :id", {id: userId})
    //     .execute();

    //     return data;
    // } catch (error) {
    //     console.log(error);
    //     throw error;
    // }
}

export default { getTagName , updateTagName };
