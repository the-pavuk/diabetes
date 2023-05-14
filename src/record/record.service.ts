import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Record } from './record.entity';
@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>
  ) {}

  async findAll(id: number, type: string) {
    if (type=="all")
      return await this.recordRepository.findBy({user_id:id})
    else {
      return await this.recordRepository.findBy({user_id:id, type:type})
    }
  
  }

  async remove(id: number): Promise<void> {
    await this.recordRepository.delete({user_id: id});
  }

  async findCountById(id: number) {
    const result = await this.recordRepository.count({
      where: { user_id: id}
    })
    return result;
  }

  findCountByType(id: number, type: string){
    return this.recordRepository.countBy({user_id: id, type: type});
  }

  async findLastFive(id: number): Promise<Record[]>{
    const result = await this.recordRepository.find({
      where: { user_id: id},
      order: { record_id: "DESC"},
      take: 5,
      skip: 0
    })
    return result;
  }

  async addRecord(record: Record){

    return await this.recordRepository.insert(record).catch(e => {

      throw new BadRequestException(e);

    })
  }

  async customRecords(type: string, id: number, limit: number, offset: number, startDate: Date, endDate: Date): Promise<Record[]> {
    if (type == "all"){
      return this.recordRepository.find({
        where:{
          user_id:id,
          datetime_of_record: Between(
            startDate,
            endDate
          )},
        order: { record_id: "DESC" },
        take: limit,
        skip: offset,
      })
    }
    return this.recordRepository.find({
      where:{
        user_id:id, 
        type:type,
        datetime_of_record: Between(
          startDate,
          endDate
        )},
      order: { record_id: "DESC" },
      take: limit,
      skip: offset,
    })
  }

  async dayRecords(type: string, id: number, limit: number, offset: number): Promise<Record[]>{
    let date1 = new Date();
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date1.setMilliseconds(0);
    let date2 = new Date();
    date2.setHours(23);
    date2.setMinutes(59);
    date2.setSeconds(59);
    date2.setMilliseconds(999);
    if (type == "all"){
      return this.recordRepository.find({
        where:{
          user_id:id, 
          datetime_of_record: Between(
            date1,
            date2
          )},
        order: { record_id: "DESC" },
      })
    }
    return this.recordRepository.find({
      where:{
        user_id:id, 
        type:type,
        datetime_of_record: Between(
          date1,
          date2
        )},
      order: { record_id: "DESC" },
    })
  }

}