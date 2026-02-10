import { Role } from 'generated/prisma/client';

export class CreateUserDto {
  schoolNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: Role;
  department: string;
  yearLevel: number;
  email: string;
  number?: string | null;
}
