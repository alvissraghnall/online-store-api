import {belongsTo, hasOne, model, property} from '@loopback/repository';
import {Product} from './product.model';
// import {EntityWithId} from './entity-with-id.model';
import {EntityWithTimestamps} from './entity-with-timestamps.model';

@model({settings: {strictObjectIDCoercion: true}})
export class CartItem extends EntityWithTimestamps {

  // @property({
  //   id: true,
  //   type: 'string'
  // })
  // id: string;

  @property({
    id: true,
    type: 'string',
    mongodb: {
      dataType: 'ObjectId'
    },
  })
  productId: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    required: false,
  })
  product: Product

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [prop: string]: any;

  constructor(data?: Partial<CartItem>) {
    super(data);
  }
}

export interface CartItemRelations {
  // describe navigational properties here
}

export type CartItemWithRelations = CartItem & CartItemRelations;
