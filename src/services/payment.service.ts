
import {injectable, /* inject, */ BindingScope, service, inject} from '@loopback/core';
import {Filter, ObjectType, repository} from '@loopback/repository';
import {FavouriteRepository, ProductRepository} from '../repositories';
import {Product, User} from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories/user.repository';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {OrderService} from './order.service';
import axios from 'axios';

type PaystackParams = {
  email: string,
  key: string, amount: number,
  currency?: 'NGN' | 'GHS' | 'ZAR' | 'USD',
  channels?: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  metadata?: any,
  callback?: (response: {reference: string, access_code: string, authorization_url: string}) => any,
  onClose?: () => any
}

@injectable({scope: BindingScope.TRANSIENT})
export class PaymentService {

  private axiosInstance = axios.create(
    {
      baseURL: 'https://api.paystack.co',
      method: 'POST',
      headers: {
        Authorization: process.env.PAYSTACK_TEST_SECRET,
        'Content-Type': 'application/json'
      }
    }
  )

  constructor(
    @service(OrderService) private readonly orderService: OrderService,
    @inject(SecurityBindings.USER) private loggedInUserProfile: UserProfile,
    @repository(UserRepository) private readonly userRepository: UserRepository,

  ) {}

  async makePayment () {
    const currUser = await this.userRepository.findById(
      this.loggedInUserProfile[securityId]
    );
    const { email, firstName, lastName } = currUser;

    const res = await this.axiosInstance.post(
      "/transaction/initialize",
      {email, name: `${firstName} ${lastName}`},
    ).catch(
      err => HttpErrors[500]("Something went wrong from our end.")
    );

    console.log(res);
  }

}
