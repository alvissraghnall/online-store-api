import {
  Entity,
  hasOne,
  model,
  property
} from '@loopback/repository';
import {User} from "../graphql-types/user.type";

@model()
export class UserAddress extends Entity {
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
    type: 'int'
  })
  postalCode: number;
}


export interface UserAddressRelations {
  // describe navigational properties here
}
