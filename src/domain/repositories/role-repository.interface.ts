import {RoleCreate, RoleResponse, RoleUpdate} from '../entities/role';

export interface RoleRepository {
  findAll(): Promise<RoleResponse[]>;
  findById(id: string): Promise<RoleResponse | null>;
  findByName(name: string): Promise<RoleResponse | null>;
  create(role: RoleCreate): Promise<RoleResponse>;
  update(id: string, role: RoleUpdate): Promise<RoleResponse | null>;
  delete(id: string): Promise<boolean>;
}
