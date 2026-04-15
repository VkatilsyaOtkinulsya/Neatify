import { BoardTemplatesEnum, MemberRoleEnum } from '@/shared/types/roles';

type MemberRole = (typeof MemberRoleEnum)[keyof typeof MemberRoleEnum];
type BoardTemplates = (typeof BoardTemplatesEnum)[keyof typeof BoardTemplatesEnum];

export interface Board {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  template: BoardTemplates;
  members: BoardMember[];
  columns: BoardColumn[];
  settings: BoardSettings;
  ownerId: string;
  position: number;

  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;

  memberCount: number;
  taskCount: number;
}

export interface BoardMember {
  userId: string;
  role: MemberRole;
  addedAt: Date;
}

export interface ProjectMember extends BoardMember {
  permissions?: string[];
}

export interface ProjectDetails {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  template: BoardTemplates;
  members: ProjectMember[];
  columns: BoardColumn[];
  settings: ProjectSettings;
  ownerId: string;
  position: number;

  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;

  memberCount: number;
  taskCount: number;
}

export interface BoardColumn {
  _id: string;
  title: string;
  position: number;
  color: string;
  taskLimit: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectSettings {
  isPublic: boolean;
  allowComments: boolean;
  requireEstimates: boolean;
  allowMemberEditing: boolean;
  enableTimeTracking: boolean;
}

export interface BoardSettings {
  isPublic: boolean;
  allowComments: boolean;
  requireEstimates: boolean;
  allowMemberEditing: boolean;
  enableTimeTracking: boolean;
}

export interface AddMemberPayload {
  email: string;
  role: MemberRole;
}
