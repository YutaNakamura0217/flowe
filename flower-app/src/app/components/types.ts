// types.ts (Frontend Types)

export interface UserProfile {
  bio?: string | null;
  cover_image?: string | null;
  profile_image?: string | null;
}

export interface UserSerializer {
  id: number;
  username: string;
  email: string;
  display_name?: string | null;
  profile?: UserProfile;
  posts_count?: number;
  followers_count?: number;
  following_count?: number;
}

export interface CommunitySerializer {
  id: number;
  name: string;
  description: string;
}

export interface EventSerializer {
  id: number;
  organizer: UserSerializer;
  community: CommunitySerializer | null;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number | null;
  fee: number | null;
  attendees: UserSerializer[];
  created_at: string;
  is_community_only: boolean;
  attendance: any[]; // より具体的に定義することも可能
}
