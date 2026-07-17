import { Injectable, NotFoundException } from '@nestjs/common';
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
    });
  }

  async findAll({ take, skip }: { take?: number; skip?: number }, userId: number) {
    return await this.prismService.note.findMany({
      where: {
        userId: userId,
      },
      take: take,
      skip: skip,
    });
  }

  async findOne(id: number, userId: number) {
    const note = await this.prismService.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (note.userId !== userId) {
      throw new NotFoundException(`Note with ID ${id} not found for this user`);
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    // First verify the note exists and belongs to the user
    const existingNote = await this.prismService.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (existingNote.userId !== userId) {
      throw new NotFoundException(`Note with ID ${id} not found for this user`);
    }

    // Now safe to update
    return await this.prismService.note.update({
      where: {
        id: id,
      },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
      },
    });
  }

  async remove(id: number, userId: number) {
    // Verify the note exists and belongs to the user before deleting
    const existingNote = await this.prismService.note.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    if (existingNote.userId !== userId) {
      throw new NotFoundException(`Note with ID ${id} not found for this user`);
    }

    return await this.prismService.note.delete({
      where: {
        id: id,
      },
    });
  }
}