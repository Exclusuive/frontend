export interface User {
  id: string;
  address: string;
  profileImg?: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Collection {
  showManage?: boolean;
  id: string;
  type: string;
  name: string;
  bannerimg?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
