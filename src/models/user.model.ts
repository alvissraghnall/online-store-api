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
import {UserCredentials, Product} from '.';
import {Favourite} from './favourite.model';

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
  @field(type => ID)
  @property({
    type: 'string',
    id: true,
    generated: true
  })
  id: string;

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
    }
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


  // @hasMany(() => Order)
  // orders: Order[];

  // @hasOne(() => ShoppingCart)
  // shoppingCart: ShoppingCart;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  favourites: Product[];
}
