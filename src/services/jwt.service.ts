import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import * as jwt from 'jsonwebtoken';
// const signAsync = promisify(jwt.sign);
// const verifyAsync = promisify<string, jwt.Secret>(jwt.verify);

const encodeJWT = (payload: object, secret: string, options: jwt.SignOptions) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      else return resolve(token);
    })
  })
}

const verifyJWT = (token: string, secret: string, options?: jwt.VerifyOptions) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, payload) => {
      if (err) return reject(err);
      else return resolve(payload);
    })
  })
}

export interface UserJwtPayload {
  id: string;
  name: string;
  email: string;
  roles: string;
}

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyJWT(token, this.jwtSecret) as UserJwtPayload;
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {
          [securityId]: decodedToken.id,
          name: decodedToken.name,
          id: decodedToken.id,
          email: decodedToken.email,
          roles: decodedToken.roles,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    const userInfoForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      roles: userProfile.roles,
      email: userProfile.email,
    };
    // Generate a JSON Web Token
    let token: string;
    try {
      token = await encodeJWT(userInfoForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      }) as string;
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error.message}`);
    }

    return token;
  }
}
