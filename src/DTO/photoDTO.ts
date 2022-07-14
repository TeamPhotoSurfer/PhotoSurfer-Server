import { TagType } from '../entity/tag/TagType';

export interface PhotoPostDTO {
  name: string;
  tagType: TagType;
  userId?: number;
}
