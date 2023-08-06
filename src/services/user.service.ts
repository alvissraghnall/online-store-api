
import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { UserRepository } from '../repositories';
import { User } from '../models';
import { HttpErrors } from '@loopback/rest';
import {repository} from '@loopback/repository';

interface UpdateUserOptions {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
}

@injectable({ scope: BindingScope.TRANSIENT })
export class UserService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async updateUser(userId: string, options: UpdateUserOptions): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpErrors.NotFound('User not found!');
    }

    // Check if the new email is already in use by another user
    if (options.email && options.email !== user.email) {
      const userWithNewEmail = await this.userRepository.findOne({ where: { email: options.email } });
      if (userWithNewEmail && userWithNewEmail.id !== userId) {
        throw new HttpErrors.BadRequest('Email already in use by another user.');
      }

      user.email = options.email;
    }

    // Update user data based on the provided options
    if (options.password) user.password = options.password;
    if (options.firstName) user.firstName = options.firstName;
    if (options.lastName) user.lastName = options.lastName;
    if (options.address) user.address = options.address;
    if (options.phone) user.phone = options.phone;

    return this.userRepository.save(user);
  }
}
