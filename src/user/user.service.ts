import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
      ) {}
    
    // Register user
    async register(registerUserDto: RegisterUserDto) {
        const {fullName, email, phoneNumber, password, role, profileBio, profileSkills, profileResume, profileResumeOriginalName, profilePhoto} = registerUserDto;

        if (!fullName || !email || !phoneNumber || !password) {
            throw new BadRequestException('All fields are required');
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        
        if(existingUser) {
            throw new BadRequestException('User already exists with this email');
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        

        const user = await this.prisma.user.create({
            data: {
                fullName,
                email,
                phoneNumber,
                password: hashedPassword,
                profileBio,
                profileSkills,
                profileResume,
                profileResumeOriginalName,
                profilePhoto,
                role,
            },
        });

        if (!user) {
            throw new BadRequestException('User not created');
        }

        return { user, success: true, message: 'Successfully user created' };
    }

    // Login user
    async login(email: string, password: string, role: string) {
        if (!email || !password || !role) {
          throw new BadRequestException('All fields are required');
        }
    
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new BadRequestException('User not exist');
        }
    
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          throw new BadRequestException('Incorrect password');
        }
    
        if (role !== user.role) {
          throw new BadRequestException("Account does not exist with current role");
        }
    
        const token = this.jwtService.sign(
          { userId: user.id },
          { secret: process.env.SECRET_KEY, expiresIn: '1d' },
        );
    
        return {
          token,
          user,
          success: true,
          message: 'Successfully logged in user',
        };
    }

    // Logout user
    async logout(): Promise<{ message: string; success: boolean }> {
        return { message: 'Logged Out successfully', success: true };
    }

     // update user
    async updateProfile(id: string, updateUserDto: UpdateUserDto) {
        const {
        fullName,
        email,
        phoneNumber,
        profileBio,
        profileSkills,
        profileResume,
        profilePhoto,
        } = updateUserDto;

        if (!fullName || !email || !phoneNumber || !profileBio || !profileSkills) {
            throw new BadRequestException('All fields are required');
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: {
                fullName,
                email,
                phoneNumber,
                profileBio,
                profileSkills,
                profileResume,
                profilePhoto,
            },
        });

        return user;
    }
    
}
