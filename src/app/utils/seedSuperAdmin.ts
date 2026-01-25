import { IAuthProvider, IUser, Role } from '../modules/users/user.interface';
import { User } from '../modules/users/user.model';
import { envVars } from './../config/env';
import bcrypt from 'bcryptjs';

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log('Super admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: 'credentials',
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload = {
      name: 'Super Admin',
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log('Super Admin Created Successfuly! \n');
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};
