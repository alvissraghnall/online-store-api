
// import {authenticate} from '@loopback/authentication';
// import {authorize} from '@loopback/authorization';
// import {
//   Count,
//   CountSchema,
//   Filter,
//   repository,
//   Where,
// } from '@loopback/repository';
// import {
//   del,
//   get,
//   getFilterSchemaFor,
//   getModelSchemaRef,
//   getWhereSchemaFor,
//   HttpErrors,
//   param,
//   patch,
//   post,
//   requestBody,
//   response,
// } from '@loopback/rest';
// import {CartItem, Order} from '../models';
// import {UserRepository} from '../repositories';
// import {basicAuthorization} from '../services';
// import {inject} from '@loopback/context';
// import {CartItemService} from '../services/cart-item.service';
// import {service} from '@loopback/core';
// import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';

// @authenticate('jwt')
// export class CartItemController {
//   constructor(
//     @service(CartItemService) readonly cartItemService: CartItemService,
//   ) {}

//    /**
//    * Create or update the orders for a given user
//    * @param userId User id
//    * @param cart Shopping cart
//    */
//   @post("/carts/{cartId}/items")
//   @response(201, {
//     description: "Add item to cart",
//     content: {
//       'application/json': {
//         schema: getModelSchemaRef(CartItem),
//       }
//     }
//   })
//   @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
//   async createCartItem(
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(CartItem, {
//             title: 'NewCart',
//             exclude: ['id'],
//             includeRelations: true
//           }),
//         },
//       },
//     }) cartItem: Omit<CartItem, "id">,
//     @param.path.string('productId') productId: string,
//   ): Promise<CartItem> {

//     const cartItemExists = await this.cartItemService.cartItemExists(productId);

//     if (cartItemExists) throw new HttpErrors.Conflict("Cart Item already exists.");

//     return this.cartItemService.addItemToCart(
//       productId,
//       cartItem.quantity
//     );


//   }

//   @get("/carts/{cartId}/items")
//   @response(200, {
//     description: "Get item from cart",
//     content: {
//       'application/json': {
//         schema: getModelSchemaRef(CartItem, {
//           includeRelations: true
//         }),
//       }
//     }
//   })
//   @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
//   async getCartItem(
//     @param.path.string('cartId') cartId: string,
//   ): Promise<CartItem> {
//     return this.cartItemService.
//   }
// }
