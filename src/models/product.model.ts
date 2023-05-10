import {
  model,
  Entity,
  property,
  hasOne
} from '@loopback/repository';
import {Discount} from './discount.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export default class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string',
    required: true
  })
  desc: string;

  @property({
    type: 'string',
    required: true
  })
  category: string;

  @property({
    type: 'number',
    required: true
  })
  price: number;

  @hasOne(() => Discount)
  discount: Discount;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt: Date;
}
