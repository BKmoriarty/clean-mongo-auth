import {User, UserCreate, UserResponse} from '../entities/user';

export interface UserRepository {
  create(user: UserCreate): Promise<UserResponse>;
  findByEmail(email: string): Promise<UserResponse | null>;
  findById(id: string): Promise<UserResponse | null>;
  update(id: string, userData: Partial<User>): Promise<UserResponse | null>;
  delete(id: string): Promise<boolean>;

  addGroupRoleToUser(
    userId: string,
    groupId: string,
    roleId: string,
  ): Promise<UserResponse | null>;
  removeGroupRoleFromUser(userId: string, groupId: string): Promise<boolean>;
}
