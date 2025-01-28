export interface EmbeddedRole {
  _id: string;
  name: string;
  description?: string;
}

export interface Group {
  id?: string;
  name: string;
  description?: string;
  roles: string[];
}

export interface GroupCreate {
  name: string;
  description?: string;
  roles: string[];
}

export interface GroupUpdate {
  name?: string;
  description?: string;
  roles?: string[];
}

export interface EmbeddedRoleResponse {
  roleId: string;
  name: string;
  description?: string;
}

export interface GroupResponse {
  id: string;
  name: string;
  description?: string;
  roles: EmbeddedRoleResponse[];
}
