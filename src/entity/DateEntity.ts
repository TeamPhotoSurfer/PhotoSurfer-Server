import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Long} from "typeorm";

export class DateEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: Long;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

export default DateEntity;