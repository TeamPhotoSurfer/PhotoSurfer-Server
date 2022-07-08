import { Long } from "typeorm";

export interface PushCreateRequest {
    userId: Long, //TODO : 임시로 여기서 userId 받음 (나중에 수정 필요)
    photoId: Long,
    pushDate: Date,
    tagIds: Long[],
    memo: string
}