import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    async createUser({name, email, password}: { name: string; email: string; password: string }): Promise<User> {
        return this.prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });
    }
}