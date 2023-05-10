import {UserService as LbkUserService} from '@loopback/authentication';
import {asService, inject, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {User} from '../graphql-types';
import {Credentials, UserRepository} from '../repositories';
import {PasswordHasherBindings} from '../util';
import {BcryptHasher, PasswordHasher} from './hash-password.service';
import _ from 'lodash';

@injectable(asService(AuthService))
export class AuthService implements LbkUserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(BcryptHasher)
    public passwordHasher: PasswordHasher,
    // @inject('services.EmailService')
    // public emailService: EmailService,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const {email, password} = credentials;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const foundUser = await this.userRepository.findOne({
      where: {email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }


  convertToUserProfile(user: User): UserProfile {
    // console.log("User: ", user);
    let userName = `${user.firstName} ${user.lastName}`;

    return {
      [securityId]: user.id,
      name: `${user.firstName} ${user.lastName}`,
      id: user.id,
      roles: user.roles,
    };
  }

  async createUser(userWithPassword: User): Promise<Omit<User, "password">> {
    const password = await this.passwordHasher.hashPassword(
      userWithPassword.password,
    );
    userWithPassword.password = password;
    const user = await this.userRepository.create(
      userWithPassword
    );
    user.id = user.id.toString();
    await this.userRepository.userCredentials(user.id).create({password});
    return _.omit(userWithPassword, 'password');
  }
}
