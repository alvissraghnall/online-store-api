import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {ProductRepository} from '../repositories';
import {Product} from '../models';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class ProductService {
  constructor(
    @repository(ProductRepository) private readonly productRepository: ProductRepository,

  ) {}

  async create(product: Omit<Product, "id">): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: {name: product.name},
    });
    if (existingProduct) {
      throw new HttpErrors.Conflict('Product already exists');
    }
    return this.productRepository.create(product);
  }

  async find(filter?: Filter<Product>): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new HttpErrors.NotFound(`Product not found: ${id}`);
    }
    return product;
  }

  async updateById(id: string, product: Partial<Product>): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  async deleteById(id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
