import type { IBoardMemberApi, MemberRole } from '@/shared/types/user.types';

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

export const normalizeUser = (user: IBoardMemberApi): SafeUser => {
  const profile = user.profile;

  const displayName =
    profile?.displayName ??
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ??
    'Удалённый пользователь';
  return {
    userId: user.userId,
    role: user.role,
    addedAt: new Date(user.addedAt),

    profile: {
      displayName,
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      avatar: profile?.avatar ?? '',
    },
  };
};
