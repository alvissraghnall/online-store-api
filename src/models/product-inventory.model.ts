import {
  model,
  Entity,
  property
} from '@loopback/repository';

@model()
export default class ProductInventory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;
  
  @property({
    type: 'number',
    required: true
  })
  quantity: number;
}