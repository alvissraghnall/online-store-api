
import {Entity, property} from '@loopback/repository';
import {EntityWithId} from './entity-with-id.model';


export class EntityWithIdAndTimestamps extends EntityWithId {
  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt: Date;

  @property({
    type: 'date',
    default: () => new Date()
  })
  updatedAt: Date;

  constructor(data?: Partial<EntityWithIdAndTimestamps>) {
    super(data);
  }
}

export interface EntityWithIdAndTimestampsRelations {
  // describe navigational properties here
}

export type EntityWithIdAndTimestampsWithRelations = EntityWithIdAndTimestamps & EntityWithIdAndTimestampsRelations;
