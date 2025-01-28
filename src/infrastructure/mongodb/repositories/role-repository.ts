import {RoleResponse, RoleCreate, RoleUpdate} from '@/domain/entities/role';
import {RoleRepository} from '@/domain/repositories/role-repository.interface';
import {RoleModel} from '../models/role-model';

export class MongoDBRoleRepository implements RoleRepository {
  async findAll(): Promise<RoleResponse[]> {
    const roles = await RoleModel.find();
    return roles.map(this.mapToRole);
  }

  async findById(id: string): Promise<RoleResponse | null> {
    const role = await RoleModel.findById(id);
    return role ? this.mapToRole(role) : null;
  }

  async findByName(name: string): Promise<RoleResponse | null> {
    const role = await RoleModel.findOne({name});
    return role ? this.mapToRole(role) : null;
  }

  async create(role: RoleCreate): Promise<RoleResponse> {
    const newRole = new RoleModel(role);
    const savedRole = await newRole.save();
    return this.mapToRole(savedRole);
  }

  async update(id: string, role: RoleUpdate): Promise<RoleResponse | null> {
    const updatedRole = await RoleModel.findByIdAndUpdate(id, role, {
      new: true,
    });
    return updatedRole ? this.mapToRole(updatedRole) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await RoleModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToRole(doc: any): RoleResponse {
    return {
      id: doc._id.toString(),
      name: doc.name,
      level: doc.level,
      description: doc.description,
    };
  }
}
