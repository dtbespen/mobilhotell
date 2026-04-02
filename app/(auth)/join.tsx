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

export default function JoinGuildScreen() {
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
    const { error, inviteCode: code } = await createFamily(
      familyName,
      displayName
    );
    setIsLoading(false);
    if (error) {
      Alert.alert("Feil", error.message);
    } else {
      Alert.alert(
        "Guildet er klart! \u{1F6E1}\u{FE0F}",
        `Guild Code: ${code}\n\nDel den med resten av guildet!`,
        [{ text: "La oss g\u00e5!", onPress: () => router.replace("/(tabs)") }]
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
      <View className="flex-1 bg-dark-300 justify-center px-8">
        <View className="items-center mb-12">
          <Text className="text-6xl">{"\u{1F6E1}\u{FE0F}"}</Text>
          <Text className="font-pixel text-lg text-white text-center mt-4">
            Velg ditt Guild
          </Text>
          <Text className="mt-2 text-base text-white/40 text-center">
            Lag et nytt guild eller bli med i et
          </Text>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            className="rounded-lg bg-primary-500 border-2 border-primary-700 py-5"
            onPress={() => setMode("create")}
            activeOpacity={0.85}
          >
            <Text className="text-center font-pixel text-sm text-white">
              Lag nytt Guild
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-lg border-2 border-white/20 py-5"
            onPress={() => setMode("join")}
            activeOpacity={0.85}
          >
            <Text className="text-center font-pixel text-sm text-white">
              Har Guild Code?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6"
            onPress={signOut}
            activeOpacity={0.6}
          >
            <Text className="text-center text-white/25">Logg ut</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-dark-300"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-16 pb-6 px-8">
          <Text className="text-5xl">
            {mode === "create" ? "\u{1F3F0}" : "\u{1F511}"}
          </Text>
          <Text className="font-pixel text-sm text-white mt-3">
            {mode === "create" ? "Lag ditt guild" : "Skriv inn Guild Code"}
          </Text>
        </View>

        <View className="flex-1 px-8 pt-6 pb-8">
          <View className="gap-4">
            <View>
              <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                Heltenavn
              </Text>
              <TextInput
                className="rounded-lg bg-dark-100 border-2 border-dark-50 px-5 py-4 text-base text-white"
                placeholder="Hva heter helten din?"
                placeholderTextColor="#555a62"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            {mode === "create" ? (
              <View>
                <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                  Guild-navn
                </Text>
                <TextInput
                  className="rounded-lg bg-dark-100 border-2 border-dark-50 px-5 py-4 text-base text-white"
                  placeholder="F.eks. Dragon Slayers"
                  placeholderTextColor="#555a62"
                  value={familyName}
                  onChangeText={setFamilyName}
                />
              </View>
            ) : (
              <View>
                <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                  Guild Code
                </Text>
                <TextInput
                  className="rounded-lg bg-dark-100 border-2 border-dark-50 px-5 py-4 text-center text-2xl font-bold tracking-[8px] text-accent-400"
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
              className="mt-2 rounded-lg bg-primary-500 border-2 border-primary-700 py-5"
              onPress={
                mode === "create" ? handleCreateFamily : handleJoinFamily
              }
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text className="text-center font-pixel text-sm text-white">
                {isLoading
                  ? "Vent..."
                  : mode === "create"
                    ? "Opprett Guild"
                    : "Bli med!"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4"
              onPress={() => setMode("choose")}
              activeOpacity={0.6}
            >
              <Text className="text-center text-white/25">
                {"\u2190"} Tilbake
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
