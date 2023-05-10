import {
  Entity,
  hasOne,
  model,
  property
} from '@loopback/repository';
import {User} from "./user.model";

@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class UserPayment extends Entity {
  @property({
    type: 'string',
    id: true
  })
  id: string;

  @hasOne(() => User)
  user: User;

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
