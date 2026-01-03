import { IUser } from './user.interface';
import { User } from './user.model';

// create user==>
const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({
    name,
    email,
  });
  return user;
};

// get all the users==>
const getAllUsers = async () => {
  const user = await User.find({});
  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
};
