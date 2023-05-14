import { Body, Controller, Get, Query, Post, HttpCode, ForbiddenException, Param, Header, BadRequestException, Res } from '@nestjs/common';
import { Record } from './record.entity';
import { RecordService } from './record.service';
import { Workbook } from 'exceljs';
import { resolve } from 'path';
import { Response } from 'express';
import { rejects } from 'assert';
import * as tmp from "tmp";

@Controller('/record/')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  ///


    @Get("count")
    getCount(@Query('user_id') userId: string){
        const id = parseInt(userId);
        return this.recordService.findCountById(id);
    }

    @Get("addRecord")
    addRecord(@Body() record: Record){
      return this.recordService.addRecord(record);
    }

    @Get('fivelast')
    findLastFive(@Query('user_id') userId: string) {
      const id = parseInt(userId);
      return this.recordService.findLastFive(id);
    }

    @Get("dayRecords")
    dayRecords(@Query('user_id') userId: string, @Query('type') type: string, @Query('limit') limit: number, @Query('offset') offset: number){
      const id = parseInt(userId);
      return this.recordService.dayRecords(type, id, limit, offset);
    }

    @Get("customRecords")
    customRecords(@Query('user_id') userId: string, @Query('type') type: string, @Query('limit') limit: number, @Query('offset') offset: number, @Query('startDate') startTime: string, @Query('endDate') endTime: string){
      const startDate = new Date(startTime)
      const endDate = new Date(endTime);
      const id = parseInt(userId);
      //type: string, id: number, limit: number, offset: number, startDate: Date, endDate: Date
      return this.recordService.customRecords(type, id, limit, offset, startDate, endDate);

    }

    @Get("getAll")
    @Header("Content-Type", "text/xlsx")
    async getAll(@Res() res: Response ,@Query('user_id') userId: string, @Query('type') type: string){
      const id = parseInt(userId);
      const records = await this.recordService.findAll(id, type);
      let rows = []
      rows.push(["Номер", "Тип замера", "Значение замера", "Дата и время замера"])
      records.forEach(element => {
        rows.push([element.record_id, element.type, element.value, element.datetime_of_record]);
      });
      let book = new Workbook();
      let sheet1 = book.addWorksheet('sheet1');
      sheet1.addRows(rows);

      let file = await new Promise((resolve, reject) => {
        tmp.file({ discardDescriptor: true, prefix: userId+'-sheet-type='+type, postfix: '.xlsx', mode: parseInt('0600', 8) }, async (err, file) => {
            if (err)
              throw new BadRequestException();

            book.xlsx.writeFile(file).then(_ =>{
              resolve(file);
            }).catch(err => {
              throw new BadRequestException();
            })
        })
      })
      res.download(`${file}`);
    }

}