export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
  gender?: 'male' | 'female';
  isLive?: boolean;
  hasStory?: boolean;
} 