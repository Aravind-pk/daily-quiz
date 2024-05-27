import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { emit } from 'process';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate hashed password
    const hashedPassword = await argon.hash(dto.password);

    // save user to db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      //TODO: remove sensitive info
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        //duplicate error
        if (error.code == 'P2002') {
          throw new ForbiddenException('User alreaady exists');
        }
      }
      throw error;
    }
  }



  async login(dto: AuthDto) {
    //find user
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Invalid credentials');

    //check password
    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Invalid credentials');
    //TODO: remove sensitive
    return user;
  }
}
