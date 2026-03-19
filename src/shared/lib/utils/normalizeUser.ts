import type { IBoardMemberWithProfile, MemberRole } from '@/shared/types/user.types';

type SafeProfile = {
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

interface SafeUser {
  userId: string;
  role: MemberRole;
  addedAt: Date;
  profile: SafeProfile;
}

export const normalizeUser = (user: IBoardMemberWithProfile): SafeUser => {
  return {
    userId: user.userId,
    role: user.role,
    addedAt: new Date(user.addedAt),

    profile: {
      displayName: user.profile.displayName ?? `${user.profile.firstName} ${user.profile.lastName}`,
      firstName: user.profile.firstName ?? '',
      lastName: user.profile.lastName ?? '',
      avatar: user.profile.avatar ?? '',
    },
  };
};
