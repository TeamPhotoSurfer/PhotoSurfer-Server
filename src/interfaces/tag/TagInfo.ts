import { Long } from "typeorm";

export interface TagInfo {
  tagId: Long;
  name?: string;
  imageURL?: string;
  bookmarkStatus?: string;
}
