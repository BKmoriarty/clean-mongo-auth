export interface GroupRole {
  groupId: string;
  roleId: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  password: string;
  groupRoles: GroupRole[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export interface UserUpdate {
  email?: string;
  name?: string;
  password?: string;
  groupRoles: GroupRole[];
}

export interface UserDelete {
  id: string;
}

export interface UserCreate {
  email: string;
  name: string;
  password: string;
  groupRoles: GroupRole[];
}
