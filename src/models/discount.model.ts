import {
  Entity, 
  model, 
  property, 
  hasOne
} from '@loopback/repository';

@model({setting: {hiddenProperties: 'id'}})
export class Discount extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;
  
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