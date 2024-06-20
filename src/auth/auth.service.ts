import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // generate hashed password
    const hashedPassword = await argon.hash(dto.password);

    // save user to db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          UserProgress:{
            create:{}
          },
          role:Role.USER //set role to user by default
        },
      });

      return this.generateToken(user.id , user.email);

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

  async signin(dto: AuthDto) {
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

    return this.generateToken(user.id , user.email);
  }

  async generateToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
