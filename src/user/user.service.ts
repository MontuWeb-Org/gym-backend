import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: number) {
    return await this.userRepository.findById(id);
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }
}
