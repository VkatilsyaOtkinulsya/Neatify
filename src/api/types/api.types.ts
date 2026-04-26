import type { UserData } from '@/features/auth/types/auth.types';
import type { Task } from '@/features/task/types/task.types';
import type { IBoardMemberSafe } from '@/shared/types/user.types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    profile: UserData;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface BoardTasksResponse {
  success: boolean;
  tasks: Task[];
  tasksByColumn: Record<string, Task[]>;
  totalCount: number;
}

export interface AddMemberResponse {
  user: IBoardMemberSafe;
}
