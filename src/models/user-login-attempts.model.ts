import {EntityWithIdAndTimestamps} from './entity-with-id-and-timestamps.model';
import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User } from './user.model'; // Import the User model

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class UserLoginAttempts extends EntityWithIdAndTimestamps {

  @belongsTo(() => User) // Define the belongsTo relation for the user ID
  userId: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  attempts: number;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  lastAttemptAt: Date;

  constructor(data?: Partial<UserLoginAttempts>) {
    super(data);
  }
}

export interface UserLoginAttemptsRelations {

}
