import {Entity, belongsTo, hasMany, model, property} from '@loopback/repository';
import {User} from '../models';
import {CartItem} from './cart-item.model';

@model()
export class Cart extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => User, {name: 'user'})
  userId: string;

  @hasMany(() => CartItem, {name: 'cartItems'})
  items: CartItem[];

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
