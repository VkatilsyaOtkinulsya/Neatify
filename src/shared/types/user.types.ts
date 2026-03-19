import type { SafeProfile } from '@/features/task/types/task.types';
import type { MemberRoleEnum } from './roles';

export type MemberRole = (typeof MemberRoleEnum)[keyof typeof MemberRoleEnum];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Profile {
  displayName?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface IBoardMemberWithProfile {
  userId: string;
  role: MemberRole;
  addedAt: Date;
  profile: SafeProfile;
}
