import {User, UserCreate, UserResponse} from '../../../domain/entities/user';
import {UserRepository} from '../../../domain/repositories/user-repository.interface';
import {UserModel} from '../models/user-model';

export class MongoDBUserRepository implements UserRepository {
  async create(user: UserCreate): Promise<UserResponse> {
    const newUser = await UserModel.create(user);
    return this.mapToUser(newUser);
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await UserModel.findOne({email});
    return user ? this.mapToUser(user) : null;
  }

  async findById(id: string): Promise<UserResponse | null> {
    const user = await UserModel.findById(id);
    return user ? this.mapToUser(user) : null;
  }

  async update(
    id: string,
    userData: Partial<User>,
  ): Promise<UserResponse | null> {
    const user = await UserModel.findByIdAndUpdate(id, userData, {new: true});
    return user ? this.mapToUser(user) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  async addGroupRoleToUser(
    userId: string,
    groupId: string,
    roleId: string,
  ): Promise<UserResponse | null> {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          groupRoles: {
            groupId,
            roleId,
          },
        },
      },
      {new: true},
    );
    return result ? this.mapToUser(result) : null;
  }

  async removeGroupRoleFromUser(
    userId: string,
    groupId: string,
  ): Promise<boolean> {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          groupRoles: {
            groupId,
          },
        },
      },
      {new: true},
    );
    return !!result;
  }

  private mapToUser(doc: any): UserResponse {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      // password: doc.password, // Password should not be returned
    };
  }
}
