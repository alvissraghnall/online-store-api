
import {injectable, /* inject, */ BindingScope, service, inject} from '@loopback/core';
import {Filter, ObjectType, repository} from '@loopback/repository';
import {FavouriteRepository, ProductRepository} from '../repositories';
import {Product, User} from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories/user.repository';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {OrderService} from './order.service';
import axios from 'axios';
import {CartService} from './cart.service';

type PaystackParams = {
  email: string, amount: number,
  currency?: 'NGN' | 'GHS' | 'ZAR' | 'USD',
  channels?: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  metadata?: any,
  callback_url?: string,
  // onClose?: () => any
}

interface PaystackTxnInitResponse {
  status: boolean;
  message: string;
  data: PaystackTxnInitData;
}

interface PaystackTxnInitData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

// response: {reference: string, access_code: string, authorization_url: string}

@injectable({scope: BindingScope.TRANSIENT})
export class PaymentService {

  private axiosInstance = axios.create(
    {
      baseURL: 'https://api.paystack.co',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
        'Content-Type': 'application/json'
      }
    }
  )

  constructor(
    @service(OrderService) private readonly orderService: OrderService,
    @service(CartService) private readonly cartService: CartService,
    @inject(SecurityBindings.USER) private loggedInUserProfile: UserProfile,
    @repository(UserRepository) private readonly userRepository: UserRepository,

  ) {}

  async makePayment (amountToPay: number) {
    console.log(amountToPay);
    const currUser = await this.userRepository.findById(
      this.loggedInUserProfile[securityId]
    );
    const cart = await this.cartService.findByUser(this.loggedInUserProfile, false);
    const amount = cart.items.reduce(
      (acc, curr) => acc += (curr.product.price * curr.quantity),
      0
    ) * 100; //multiplying by 100 to get value in cents.

    const data: PaystackParams = {
      email: currUser.email,
      amount,
      currency: "USD",
      callback_url: 'http://localhost:4000/prior-to-order',
      metadata: JSON.stringify(cart.items)
    }

    const res = await this.axiosInstance.post<PaystackTxnInitResponse>(
      "/transaction/initialize",
      data,
    ).catch(
      err => HttpErrors[500]("Something went wrong from our end.")
    );

    console.log(res);
    return res.data;
  }

}
