import {belongsTo, model, property} from '@loopback/repository';
import {User} from '../models';
import {CartItem} from './cart-item.model';
import {EntityWithIdAndTimestamps} from './entity-with-id-and-timestamps.model';


@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class Order extends EntityWithIdAndTimestamps {

  @belongsTo(() => User)
  userId: string;

  @property.array(CartItem, {required: true})
  products: CartItem[];

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['pending', 'processing', 'completed', 'cancelled']
    },
  })
  status: string;

  @property({
    type: 'date',
  })
  date?: string;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
