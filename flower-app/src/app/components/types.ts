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
interface CommunityMember {
  user: {
    id: number;
    username: string;
    display_name: string;
    profile_image: string;  // null の可能性があれば string | null
  };
  joined_at: string;
}
export interface CommunitySerializer {
  id: number;
  name: string;
  description: string;
  cover_image: string | null;
  members_count: number;
  created_at: string;
  is_regional: boolean;
  is_member: boolean;
  members: CommunityMember[];
  posts: Post[];
  events: Event[];
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


export interface User {
  id: number;
  username: string;
  email: string;
  profile: {   
    bio: string;
    cover_image: string;
    profile_image: string;
  };
  posts_count: number;
  followers_count: number;
  following_count: number;
}

export interface Post {
  id: number;
  image_url: string;
  caption: string;
  likes: number;
  comments: number;
  user: User;
  created_at: string;
  updated_at: string;
  tags: string[];
  variety_name: string;
  location: string;
  public_status: boolean;
}

export interface Community {
  id: number;
  name: string;
  memberCount: number;
  cover_image: string | null;
}

// ページネーションされたレスポンス用の型
export interface PaginatedPosts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export interface PaginatedCommunities {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommunitySerializer[];
}
