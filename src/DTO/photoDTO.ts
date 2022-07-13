import { StillWaitingResponseFrequency } from 'aws-sdk/clients/lexmodelsv2';
import { TagType } from '../entity/tag/TagType';

export interface PhotoPostDTO {
  name: string;
  tagType: TagType;
  userId?: number;
}

export interface PhotoPostResponseDTO {
  id: string;
  imageURL: string;
}
