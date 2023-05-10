import {
  Entity,
  model,
  property,
  hasOne
} from '@loopback/repository';

@model({
  settings: {
    hiddenProperties: ['id'],
    strictObjectIDCoercion: true,
  }
})
export class Discount extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'number',
    required: true
  })
  percentage: number;

  @property({
    type: 'boolean',
    required: true
  })
  active: boolean;
}

export interface DiscountRelations {}
