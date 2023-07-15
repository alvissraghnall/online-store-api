import {belongsTo, model, property} from '@loopback/repository';
import {User} from '../models';
import {CartItem} from './cart-item.model';
import {EntityWithIdAndTimestamps} from './entity-with-id-and-timestamps.model';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
};

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
    jsonSchema: {
      enum: [OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      default: OrderStatus.PENDING
    },
  })
  status: string;

  @property({
    type: 'date',
  })
  date?: Date;

  @property({
    type: 'string',
  })
  reference: string;

  @property({
    type: 'string',
  })
  access_code: string;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
  user?: User
}

export type OrderWithRelations = Order & OrderRelations;
