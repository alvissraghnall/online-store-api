import {
  model,
  Entity,
  property,
  hasOne
} from '@loopback/repository';
import {Discount} from './discount.model';
import {ProductInventory} from './product-inventory.model';
import {EntityWithIdAndTimestamps} from './entity-with-id-and-timestamps.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Product extends EntityWithIdAndTimestamps {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 3,
      maxLength: 50
    }
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 10,
      maxLength: 500
    }
  })
  description: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 3,
    }
  })
  category: string;

  @property({
    type: 'number',
    required: true
  })
  price: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 5,
    }
  })
  image: string;

  @hasOne(() => Discount)
  discount: Discount;

  @hasOne(() => ProductInventory)
  inventory: ProductInventory;

  // @property({
  //   type: 'date',
  //   default: () => new Date()
  // })
  // createdAt: Date;
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
