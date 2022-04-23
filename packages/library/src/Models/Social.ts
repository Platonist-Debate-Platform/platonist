export interface Social {
  created_at: Date;
  icon: string;
  id: number;
  link: string;
  title: string;
  updated_at: Date;
}

export interface SocialItem {
  id: number;
  title: string;
  socials?: (Social | null)[] | null;
}
