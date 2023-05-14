import { Body, Controller, Get, Query, Post, HttpCode, ForbiddenException, Param } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('/user/')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get("/firstUse")
  private firstUse(@Body() user: User){
        return this.usersService.firstStart(user);
  }

  @Get("allUsers")
  private async allUsers(@Query('user_id') uid: string){
    const id = parseInt(uid);
    let user = this.usersService.findOne(id);
    if ((await user).isAdmin){
        return this.usersService.findAll();
    } else {
        return new ForbiddenException();
    }
  }
  
  @Get("getUser")
  private async getUser(@Param('id') id){
    return await this.usersService.findOne(id);
  }

}