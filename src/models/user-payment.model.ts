import {
  Entity,
  hasOne,
  model,
  property
} from '@loopback/repository';
import {User} from "../graphql-types/user.type";

@model()
export class UserPayment extends Entity {
  @property({
    type: 'int',
    id: true
  })
  id: number;


  @hasOne(() => User)
  userId: User;

  @property({
    type: 'string'
  })
  paymentType: string;

  @property({
    type: 'string'
  })
  provider: string;

  @property({
    type: 'number'
  })
  accountNumber: number;

  @property({
    type: 'timestamp'
  })
  expiry: Date
}
