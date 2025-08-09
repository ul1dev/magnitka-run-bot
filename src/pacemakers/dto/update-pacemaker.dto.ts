import { PartialType } from '@nestjs/mapped-types';
import { CreatePacemakerDto } from './create-pacemaker.dto';

export class UpdatePacemakerDto extends PartialType(CreatePacemakerDto) {}
