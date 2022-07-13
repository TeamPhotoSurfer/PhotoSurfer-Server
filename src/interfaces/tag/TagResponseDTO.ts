import { Long } from "typeorm"
import { TagInfo } from "./TagInfo";

export interface TagResponseDTO{
    userId: Long;
    tags: TagInfo[];
}