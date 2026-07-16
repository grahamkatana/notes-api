import { UseGuards,Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req: { user: { sub: number }}) {
    return this.noteService.create(createNoteDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req: { user: { sub: number }}) {
    return this.noteService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: { user: { sub: number }}) {
    return this.noteService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Request() req: { user: { sub: number }}) {
    return this.noteService.update(+id, updateNoteDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: { sub: number }}) {
    return this.noteService.remove(+id, req.user.sub);
  }
}
