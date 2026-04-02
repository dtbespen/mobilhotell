export type ActivityCategory = "screen_free" | "reading" | "creating" | "custom";
export type ActivitySource = "manual" | "sensor" | "screen_time_api";
export type UserRole = "parent" | "child";

export type Family = {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
};

export type Profile = {
  id: string;
  family_id: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
};

export type ActivityType = {
  id: string;
  family_id: string;
  name: string;
  category: ActivityCategory;
  points_per_minute: number;
  icon: string;
  is_default: boolean;
  created_at: string;
};

export type Activity = {
  id: string;
  profile_id: string;
  activity_type_id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  points_earned: number;
  source: ActivitySource;
  metadata: Record<string, unknown> | null;
  created_at: string;
  activity_type?: ActivityType;
  profile?: Profile;
};

export type BlockedApp = {
  id: string;
  family_id: string;
  app_name: string;
  bundle_id: string | null;
  created_at: string;
};

export type Reward = {
  id: string;
  family_id: string;
  name: string;
  points_cost: number;
  created_at: string;
};
