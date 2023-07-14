import {Entity} from '@loopback/repository';

export abstract class Service<T extends Entity> {

  abstract create(): Partial<T>;

  abstract updateById(): void;
}
