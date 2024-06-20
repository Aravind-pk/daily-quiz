import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getById(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select:{
        id:true,
        email:true,
        firtName:true,
        lastName:true,
        role:true
      }
    });

    if (!user) throw new NotFoundException(`The user with id ${userId} not found`);

    return user;
  }
}
