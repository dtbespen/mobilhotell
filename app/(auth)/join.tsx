import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
      Alert.alert("Feil", "Vennligst fyll inn alle feltene");
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
        "Familie opprettet!",
        `Din invitasjonskode er: ${code}\n\nDel denne med familien din så de kan bli med.`,
        [{ text: "Flott!", onPress: () => router.replace("/(tabs)") }]
      );
    }
  }

  async function handleJoinFamily() {
    if (!inviteCode || !displayName) {
      Alert.alert("Feil", "Vennligst fyll inn alle feltene");
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
      <View className="flex-1 justify-center bg-white px-8">
        <View className="mb-12 items-center">
          <Text className="text-4xl font-bold text-primary-600">
            Velkommen!
          </Text>
          <Text className="mt-2 text-center text-lg text-gray-500">
            Opprett en ny familie eller bli med i en eksisterende
          </Text>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            className="rounded-xl bg-primary-600 px-4 py-4"
            onPress={() => setMode("create")}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-semibold text-white">
              Opprett ny familie
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-xl border-2 border-primary-600 px-4 py-4"
            onPress={() => setMode("join")}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-semibold text-primary-600">
              Bli med i familie
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={signOut}
            activeOpacity={0.6}
          >
            <Text className="text-center text-gray-400">Logg ut</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-primary-600">
            {mode === "create" ? "Opprett familie" : "Bli med i familie"}
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="mb-1 text-sm font-medium text-gray-700">
              Ditt navn
            </Text>
            <TextInput
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base"
              placeholder="F.eks. Mamma, Pappa, Ola..."
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          {mode === "create" ? (
            <View>
              <Text className="mb-1 text-sm font-medium text-gray-700">
                Familienavn
              </Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base"
                placeholder="F.eks. Familien Nergaard"
                value={familyName}
                onChangeText={setFamilyName}
              />
            </View>
          ) : (
            <View>
              <Text className="mb-1 text-sm font-medium text-gray-700">
                Invitasjonskode
              </Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-center text-xl font-bold tracking-widest"
                placeholder="ABC123"
                value={inviteCode}
                onChangeText={setInviteCode}
                autoCapitalize="characters"
                maxLength={6}
              />
            </View>
          )}

          <TouchableOpacity
            className="mt-4 rounded-xl bg-primary-600 px-4 py-4"
            onPress={
              mode === "create" ? handleCreateFamily : handleJoinFamily
            }
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-semibold text-white">
              {isLoading
                ? "Vennligst vent..."
                : mode === "create"
                  ? "Opprett familie"
                  : "Bli med"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-2"
            onPress={() => setMode("choose")}
            activeOpacity={0.6}
          >
            <Text className="text-center text-gray-500">Tilbake</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
