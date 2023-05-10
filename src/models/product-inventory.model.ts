import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class ProductInventory extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: string;


  constructor(data?: Partial<ProductInventory>) {
    super(data);
  }
}

export interface ProductInventoryRelations {
  // describe navigational properties here
}

export type ProductInventoryWithRelations = ProductInventory & ProductInventoryRelations;
