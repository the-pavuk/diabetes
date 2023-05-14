import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Double, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Record{
    @PrimaryGeneratedColumn()
    record_id: number;
    @ManyToOne(() => User, user => user.user_id)
    @JoinColumn({name: "user_id"})
    @Column({
        nullable: false,
        type: 'bigint',
    })
    user_id: number
    @Column({
        nullable: false
    })
    @Column({
        nullable: false,
        type: 'datetime'
    })
    datetime_of_record: Date
    @Column({
        nullable: false
    })
    type: string
    @Column({
        nullable: false,
        type: 'double'
    })
    value: string
}

