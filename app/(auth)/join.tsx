import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";

export default function JoinFamilyScreen() {
  const { createFamily, joinFamily, signOut } = useAuth();
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [familyName, setFamilyName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateFamily() {
    if (!familyName || !displayName) {
      Alert.alert("Hei!", "Fyll inn begge feltene");
      return;
    }
    setIsLoading(true);
    const { error, inviteCode: code } = await createFamily(familyName, displayName);
    setIsLoading(false);
    if (error) {
      Alert.alert("Feil", error.message);
    } else {
      Alert.alert(
        "Familien er klar! 🏠",
        `Invitasjonskode: ${code}\n\nSend den til resten av familien!`,
        [{ text: "La oss gå!", onPress: () => router.replace("/(tabs)") }]
      );
    }
  }

  async function handleJoinFamily() {
    if (!inviteCode || !displayName) {
      Alert.alert("Hei!", "Fyll inn begge feltene");
      return;
    }
    setIsLoading(true);
    const { error } = await joinFamily(inviteCode, displayName);
    setIsLoading(false);
    if (error) {
      Alert.alert("Feil", error.message);
    } else {
      router.replace("/(tabs)");
    }
  }

  if (mode === "choose") {
    return (
      <View className="flex-1 bg-info-500 justify-center px-8">
        <View className="items-center mb-12">
          <Text style={{ fontSize: 64 }}>👨‍👩‍👧‍👦</Text>
          <Text className="mt-4 text-3xl font-bold text-white text-center">
            Hvem unpluger{"\n"}du med?
          </Text>
          <Text className="mt-2 text-base text-white/50 text-center">
            Unplug er best som team
          </Text>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            className="rounded-2xl bg-white py-5"
            onPress={() => setMode("create")}
            activeOpacity={0.85}
          >
            <Text className="text-center text-lg font-bold text-info-600">
              Start nytt team 🚀
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-2xl border-2 border-white/30 py-5"
            onPress={() => setMode("join")}
            activeOpacity={0.85}
          >
            <Text className="text-center text-lg font-bold text-white">
              Har en kode? Bli med 🎟️
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="mt-6" onPress={signOut} activeOpacity={0.6}>
            <Text className="text-center text-white/25">Logg ut</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-info-500"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-16 pb-6 px-8">
          <Text style={{ fontSize: 52 }}>
            {mode === "create" ? "🏠" : "🎟️"}
          </Text>
          <Text className="mt-2 text-2xl font-bold text-white">
            {mode === "create" ? "Lag teamet ditt" : "Skriv inn koden"}
          </Text>
        </View>

        <View className="flex-1 rounded-t-[36px] px-8 pt-10 pb-8 bg-dark-300">
          <View className="gap-4">
            <View>
              <Text className="mb-2 text-sm font-bold text-white/20 uppercase tracking-wider">
                Hva heter du?
              </Text>
              <TextInput
                className="rounded-2xl bg-dark-100 px-5 py-4 text-base text-white"
                placeholder="Skriv navnet ditt her..."
                placeholderTextColor="#555a62"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            {mode === "create" ? (
              <View>
                <Text className="mb-2 text-sm font-bold text-white/20 uppercase tracking-wider">
                  Teamnavn
                </Text>
                <TextInput
                  className="rounded-2xl bg-dark-100 px-5 py-4 text-base text-white"
                  placeholder="F.eks. Team Nergaard"
                  placeholderTextColor="#555a62"
                  value={familyName}
                  onChangeText={setFamilyName}
                />
              </View>
            ) : (
              <View>
                <Text className="mb-2 text-sm font-bold text-white/20 uppercase tracking-wider">
                  Invitasjonskode
                </Text>
                <TextInput
                  className="rounded-2xl bg-dark-100 px-5 py-4 text-center text-2xl font-bold tracking-[8px] text-white"
                  placeholder="ABC123"
                  placeholderTextColor="#555a62"
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  autoCapitalize="characters"
                  maxLength={6}
                />
              </View>
            )}

            <TouchableOpacity
              className="mt-2 rounded-2xl bg-primary-500 py-5"
              onPress={mode === "create" ? handleCreateFamily : handleJoinFamily}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text className="text-center text-lg font-bold text-white">
                {isLoading
                  ? "Vent litt..."
                  : mode === "create"
                    ? "Opprett team! 🎯"
                    : "Bli med! 🙌"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4" onPress={() => setMode("choose")} activeOpacity={0.6}>
              <Text className="text-center font-semibold text-white/25">
                ← Tilbake
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
