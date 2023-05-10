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
export class UserAddress extends Entity {
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
  addressLineUno: string;

  @property({
    type: 'string'
  })
  addressLineDeux: string;

  @property({
    type: 'string'
  })
  city: string;

  @property({
    type: 'string'
  })
  mobile: string;

  @property({
    type: 'string'
  })
  country: string;

  @property({
    type: 'number'
  })
  postalCode: number;
}


export interface UserAddressRelations {
  // describe navigational properties here
}
