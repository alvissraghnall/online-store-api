import {Entity, property} from '@loopback/repository';


export class EntityWithId extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  constructor(data?: Partial<EntityWithId>) {
    super(data);
  }
}

export interface EntityWithIdRelations {
  // describe navigational properties here
}

export type EntityWithIdWithRelations = EntityWithId & EntityWithIdRelations;
