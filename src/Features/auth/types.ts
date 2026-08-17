export type UserRole = 'ADMIN' | 'ATTENDEE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}