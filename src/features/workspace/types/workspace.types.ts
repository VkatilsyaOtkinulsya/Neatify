import { MemberRoleEnum } from '@/shared/types/roles';

type MemberRole = (typeof MemberRoleEnum)[keyof typeof MemberRoleEnum];

export interface Workspace {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  members: WorkspaceMember[];
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
  archivedAt: Date | null;
}

export interface WorkspaceSettings {
  isPublic: boolean;
  color: string;
}

export interface WorkspaceMember {
  userId: string;
  role: MemberRole;
  addedAt: Date;
}

export interface SpacesData {
  spaces: Workspace[];
}
