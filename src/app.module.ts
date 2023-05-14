import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { RecordModule } from './record/record.module';
import { Record } from './record/record.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'rooot',
    database: 'diabetes',
    entities: [User, Record],
    synchronize: true, // если у этого будет релиз, то убрать
  }), UserModule, RecordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
