import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  family_id: string;
  display_name: string;
  avatar_url: string | null;
  role: "parent" | "child";
};

export type Family = {
  id: string;
  name: string;
  invite_code: string;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  family: Family | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  createFamily: (
    familyName: string,
    displayName: string
  ) => Promise<{ error: Error | null; inviteCode?: string }>;
  joinFamily: (
    inviteCode: string,
    displayName: string
  ) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setFamily(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const userId = session.user.id;
    const channelName = `auth-profile-${userId}`;
    const existing = supabase.getChannels().find((ch) => ch.topic === `realtime:${channelName}`);
    if (existing) supabase.removeChannel(existing);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  async function fetchProfile(userId: string) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError || !profileData) {
        setProfile(null);
        setFamily(null);
        setIsLoading(false);
        return;
      }

      setProfile(profileData);

      if (profileData.family_id) {
        const { data: familyData } = await supabase
          .from("families")
          .select("*")
          .eq("id", profileData.family_id)
          .single();

        setFamily(familyData);
      }
    } catch {
      setProfile(null);
      setFamily(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshProfile() {
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error ? new Error(error.message) : null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ? new Error(error.message) : null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    setFamily(null);
  }

  async function createFamily(familyName: string, displayName: string) {
    if (!session?.user) return { error: new Error("Ikke innlogget") };

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data: familyData, error: familyError } = await supabase
      .from("families")
      .insert({ name: familyName, invite_code: inviteCode })
      .select()
      .single();

    if (familyError)
      return { error: new Error(familyError.message) };

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: session.user.id,
      family_id: familyData.id,
      display_name: displayName,
      role: "parent",
    });

    if (profileError)
      return { error: new Error(profileError.message) };

    await fetchProfile(session.user.id);
    return { error: null, inviteCode };
  }

  async function joinFamily(inviteCode: string, displayName: string) {
    if (!session?.user) return { error: new Error("Ikke innlogget") };

    const { data: familyData, error: familyError } = await supabase
      .from("families")
      .select("*")
      .eq("invite_code", inviteCode.toUpperCase())
      .single();

    if (familyError || !familyData)
      return { error: new Error("Ugyldig invitasjonskode") };

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: session.user.id,
      family_id: familyData.id,
      display_name: displayName,
      role: "child",
    });

    if (profileError)
      return { error: new Error(profileError.message) };

    await fetchProfile(session.user.id);
    return { error: null };
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        family,
        isLoading,
        signUp,
        signIn,
        signOut,
        createFamily,
        joinFamily,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
