/** The currently connected backend exposes administrator accounts only. */
export type UserRole = 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}
