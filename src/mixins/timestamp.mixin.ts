import {Constructor} from '@loopback/context';
import {Entity, EntityCrudRepository, DataObject, Where, Count, Options, AnyObject} from '@loopback/repository';

export function TimeStampRepositoryMixin<
  E extends Entity & {createdAt?: Date; updatedAt?: Date},
  ID,
  R extends Constructor<EntityCrudRepository<E, ID>>
>(repository: R) {
  return class extends repository {
    async create(entity: DataObject<E>, options?: Options): Promise<E> {
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      return super.create(entity, options);
    }

    async updateAll(
      data: DataObject<E>,
      where?: Where<E>,
      options?: Options,
    ): Promise<Count> {
      data.updatedAt = new Date();
      return super.updateAll(data, where, options);
    }

    async update(entity: DataObject<E>, options?: AnyObject | undefined): Promise<void> {
      entity.updatedAt = new Date();
      return super.update(entity, options)
    }

    async save(entity: DataObject<E>, options?: AnyObject | undefined): Promise<E> {
      entity.updatedAt = new Date();
      if(!entity.getId) entity.createdAt = new Date();
      return super.save(entity, options);
    }

    async replaceById(
      id: ID,
      data: DataObject<E>,
      options?: Options,
    ): Promise<void> {
      data.updatedAt = new Date();
      return super.replaceById(id, data, options);
    }
  }
  // return MixedRepository;
}
