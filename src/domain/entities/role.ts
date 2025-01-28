export interface Role {
  id?: string;
  name: string;
  level: number;
  description?: string;
}

export interface RoleCreate {
  name: string;
  level?: number;
  description?: string;
}

export interface RoleUpdate {
  name?: string;
  level?: number;
  description?: string;
}

export interface RoleDelete {
  id: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  level: number;
  description?: string;
}
