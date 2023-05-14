import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ user_id: id });
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete({user_id: id});
  }

  async firstStart(user: User){
    return await this.usersRepository.insert(user).catch(e => {
        throw new ForbiddenException();
    })
  }

}