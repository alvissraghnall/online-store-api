import {
  Entity, 
  model, 
  property, 
} from '@loopback/repository';

@model()
export class ProductCategory extends Entity {
  @property({
    id: true,
    type: 'number'
  })
  id: number;
  
  @property({
    type: 'string',
    required: true
  })
  name: string;
  
  @property({
    type: 'string',
    
  })
  description: string;
}