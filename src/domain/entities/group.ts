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
  parentId?: string | null; // Reference to parent group
  children?: string[]; // Reference to child groups
}

export interface GroupCreate {
  name: string;
  description?: string;
  roles?: string[];
  parentId?: string | null; // Allow setting parent group on creation
}

export interface GroupUpdate {
  name?: string;
  description?: string;
  roles?: string[];
  parentId?: string | null; // Allow updating parent group
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
  parentId?: string | null;
  children?: GroupResponse[]; // Include children when fetching full hierarchy
}
