// types.ts
export interface Community {
  id: number;
  name: string;
  description: string;
  member_count?: number;
  members_count?: number; 
  cover_image?: string;
  created_at?: string;
  is_regional?: boolean;
  is_member?: boolean;
  members?: any[];
  posts?: any[]; 
  events?: any[]; 
}