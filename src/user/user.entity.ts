import { Entity, Column, PrimaryColumn} from 'typeorm';

@Entity()
export class User{
    @PrimaryColumn({type: 'bigint'})
    user_id: number;
    @Column({
        nullable: false
    })
    name: string
    @Column({
        nullable: false
    })
    date_of_register: Date
    @Column()
    isAdmin: number
}