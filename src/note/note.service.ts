import { Injectable, Request } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NoteService {
  constructor(private readonly prismService: PrismaService) {}
  async create(createNoteDto: CreateNoteDto, userId: number) {
    return await this.prismService.note.create({
      data: {
        title: createNoteDto.title!,
        content: createNoteDto.content!,
        userId: userId,
      },
    })
   
  }

  async findAll(userId: number) {
    return await this.prismService.note.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findOne(id: number, userId: number) {
    return await this.prismService.note.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });
  }   
  

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    return await this.prismService.note.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
      },
    });
  }

  async remove(id: number, userId: number) {
    return await this.prismService.note.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }
}
