import { Icon } from "./Icon";
import { ContentKeys } from "./Content";

export interface CompanyLocation {
  id: number;
  city: string;
  title: string;
  street: string;
  zip: string;
  email?: string | null;
  phone?: string | null;
  icon?: Icon | null;
  created_at: Date;
  updated_at: Date;
  ordering: number | null;
}

export interface CompanyLocationItem {
  company_location?: CompanyLocation | null;
  id: number;
}
export interface CompanyLocationList {
  __component: ContentKeys;
  id: number;
  items?: (CompanyLocationItem | null)[] | null;
  lead?: string | null;
  title: string;
}
