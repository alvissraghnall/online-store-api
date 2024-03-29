import {EntityWithIdAndTimestamps} from './entity-with-id-and-timestamps.model';
import {
  Entity,
  hasMany,
  hasOne,
  model,
  property
} from '@loopback/repository';
// import {Order} from './order.model';
// import {UserCredentials} from './user-credentials.model';
// import {ShoppingCart} from './shopping-cart.model';
import {field, ID, objectType} from '@loopback/graphql';
import {UserCredentials, Product, Order, Review} from '.';
import {Favourite} from './favourite.model';
import {UserLoginAttempts} from './user-login-attempts.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
    indexes: {

      // uniqueEmail: {
      //   keys: {
      //     email: 1,
      //   },
      //   options: {
      //     unique: true,
      //   },
      // },
    },
  },
})
@objectType({description: 'Object representing user information'})
export class User extends EntityWithIdAndTimestamps {

  @field(() => String)
  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
    jsonSchema: {
      format: 'email',
      minLength: 5,
    }
  })
  email: string;

  @field(() => String)
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 3,
    }
  })
  firstName: string;

  @field(() => String)
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 3,
    }
  })
  lastName: string;

  @field(() => String)
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 10,
    }
  })
  address: string;

  @field(() => String)
  @property({
    type: "string",
    required: true,
    jsonSchema: {
      minLength: 5,
    }
  })
  phone: string;

  @property({
    type: "string",
    required: false,
    jsonSchema: {
      minLength: 8,
    },
    hidden: true
  })
  password: string;

  @property({
    type: "string",
    required: true,
    jsonSchema: {
      const: {$data: '1/password'},
    },
    hidden: true
  })
  confirmPassword: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];


  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasMany(() => Product, {through: {model: () => Favourite}})
  favourites: Product[];


  @hasMany(() => Order)
  orders: Order[];

  @hasMany(() => Review)
  reviews: Review[];

  @hasOne(() => UserLoginAttempts) // Define the hasOne relation for the user's login attempts
  loginAttempts: UserLoginAttempts;

  // @hasOne(() => ShoppingCart)
  // shoppingCart: ShoppingCart;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  favourites: Product[];

  loginAttempts: UserLoginAttempts;

  orders: Order[];

  reviews: Review[];

  userCredentials: UserCredentials;

}
