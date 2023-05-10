import {bind, /* inject, */ BindingScope} from '@loopback/core';
import * as bcrypt from 'bcryptjs';

@bind({scope: BindingScope.TRANSIENT})
export class BCryptService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}
