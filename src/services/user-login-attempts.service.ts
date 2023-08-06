
import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { UserLoginAttemptsRepository } from '../repositories';
import { HttpErrors } from '@loopback/rest';
import {repository} from '@loopback/repository';

@injectable({ scope: BindingScope.TRANSIENT })
export class UserLoginAttemptsService {
  constructor(
    // Inject the UserLoginAttemptsRepository
    @repository(UserLoginAttemptsRepository)
    public userLoginAttemptsRepository: UserLoginAttemptsRepository,
  ) {}

  async checkLoginAttempts(userId: string): Promise<void> {
    const MAX_LOGIN_ATTEMPTS = 5; // Set the maximum allowed login attempts
    const LOCKOUT_TIME = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

    // Get the user's login attempts
    const userLoginAttempts = await this.userLoginAttemptsRepository.findOne({
      where: { userId },
      order: ['lastAttemptAt DESC'],
    });

    // If the userLoginAttempts object is not found, create a new record for the user
    if (!userLoginAttempts) {
      await this.userLoginAttemptsRepository.create({
        userId,
        attempts: 1,
        lastAttemptAt: new Date(),
      });
    } else {
      // If the user has exceeded the maximum login attempts, check if the lockout time has passed
      if (userLoginAttempts.attempts >= MAX_LOGIN_ATTEMPTS) {
        const lastAttemptTime = userLoginAttempts.lastAttemptAt.getTime();
        const now = Date.now();

        // If the lockout time has not passed, throw a custom error indicating the lockout time
        if (now - lastAttemptTime < LOCKOUT_TIME) {
          const remainingTime = LOCKOUT_TIME - (now - lastAttemptTime);
          throw new HttpErrors.Unauthorized(
            `Too many login attempts. Please try again in ${Math.ceil(
              remainingTime / 60000,
            )} minutes.`,
          );
        } else {
          // If the lockout time has passed, reset login attempts
          userLoginAttempts.attempts = 0;
          userLoginAttempts.lastAttemptAt = new Date();
          await this.userLoginAttemptsRepository.update(userLoginAttempts);
        }
      }
    }
  }

  async handleSuccessfulLogin(userId: string): Promise<void> {
    // Get the user's login attempts
    const userLoginAttempts = await this.userLoginAttemptsRepository.findOne({
      where: { userId },
    });

    // If the userLoginAttempts object is not found, create a new record for the user
    if (!userLoginAttempts) {
      await this.userLoginAttemptsRepository.create({
        userId,
        attempts: 0,
        lastAttemptAt: new Date(),
      });
    } else {
      // Reset login attempts on successful login
      userLoginAttempts.attempts = 0;
      userLoginAttempts.lastAttemptAt = new Date();
      await this.userLoginAttemptsRepository.update(userLoginAttempts);
    }
  }

  async handleFailedLogin(userId: string): Promise<void> {
    // Get the user's login attempts
    const userLoginAttempts = await this.userLoginAttemptsRepository.findOne({
      where: { userId },
    });

    // If the userLoginAttempts object is not found, create a new record for the user
    if (!userLoginAttempts) {
      await this.userLoginAttemptsRepository.create({
        userId,
        attempts: 1,
        lastAttemptAt: new Date(),
      });
    } else {
      // Add the current time to the login attempts
      userLoginAttempts.attempts += 1;
      userLoginAttempts.lastAttemptAt = new Date();
      await this.userLoginAttemptsRepository.update(userLoginAttempts);
    }
  }
}
