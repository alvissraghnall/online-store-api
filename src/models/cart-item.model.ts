import {Entity, hasOne, model, property} from '@loopback/repository';
import {Product} from './product.model';

@model({settings: {strictObjectIDCoercion: true}})
export class CartItem extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @hasOne(() => Product)
  product: Product;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CartItem>) {
    super(data);
  }
}

export interface CartItemRelations {
  // describe navigational properties here
}

export type CartItemWithRelations = CartItem & CartItemRelations;
