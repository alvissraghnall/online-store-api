import {
  Entity,
  belongsTo,
  model,
  property,
} from '@loopback/repository';

@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class ProductCategory extends Entity {
  @property({
    id: true,
    type: 'string',
    generated: true
  })
  id: string;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string',
  })
  description: string;

  @belongsTo(() => ProductCategory, {
    keyTo: 'id',
    name: 'parentCategory'
  })
  parentId: string;
}
