
import {
  Entity, 
  model, 
  property, 
  hasMany, 
  hasOne
} from '@loopback/repository';
import {Order} from './order.model';
import {UserCredentials} from './user-credentials.model';
import {ShoppingCart} from './shopping-cart.model';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  firstName: string;

  @property({
    type: 'string',
    required: true
  })
  lastName: string;
  
  @property({
    type: 'string',
    required: true
  })
  address: string;
  
  @property({
    type: "string",
    required: true
  })
  phone: string;
  
  @property({
    type: "string",
    required: true
  })
  password: string;

  @hasMany(() => Order)
  orders: Order[];

  @hasOne(() => ShoppingCart)
  shoppingCart: ShoppingCart;
 
  constructor(data?: Partial<User>) {
    super(data);
  }
}