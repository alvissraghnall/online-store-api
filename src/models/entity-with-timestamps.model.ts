
import {Entity, property} from '@loopback/repository';


export class EntityWithTimestamps extends Entity {
  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt: Date;

  @property({
    type: 'date',
    // default: () => new Date()
  })
  updatedAt: Date;

  constructor(data?: Partial<EntityWithTimestamps>) {
    super(data);
  }
}

export interface EntityWithTimestampsRelations {
  // describe navigational properties here
}

export type EntityWithIdAndTimestampsWithRelations = EntityWithTimestamps & EntityWithTimestampsRelations;
