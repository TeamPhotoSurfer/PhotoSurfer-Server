import { Long } from "typeorm";

export interface PushCreateRequest {
    pushDate: Date,
    tagIds: Long[],
    memo: string
}