import {
  model,
  Entity,
  property,
  hasOne
} from '@loopback/repository';
import {Discount} from './discount.model';
import {ProductInventory} from './product-inventory.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Product extends Entity {
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

  @property({
    type: 'string',
    required: true
  })
  image: string;

  @hasOne(() => Discount)
  discount: Discount;

  @hasOne(() => ProductInventory)
  inventory: ProductInventory;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt: Date;
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
