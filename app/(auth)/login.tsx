import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/lib/auth";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Hei!", "Fyll inn e-post og passord");
      return;
    }
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      Alert.alert("Hmm...", error.message);
    }
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
        <View className="items-center pt-20 pb-10 px-8">
          <View className="flex-row gap-2 mb-4">
            <Text className="text-4xl">{"\u{1F9D9}"}</Text>
            <Text className="text-4xl">{"\u2694\uFE0F"}</Text>
            <Text className="text-4xl">{"\u{1F33F}"}</Text>
            <Text className="text-4xl">{"\u{1F5E1}\uFE0F"}</Text>
          </View>
          <Text className="font-pixel text-2xl text-primary-400">
            Unplug
          </Text>
          <Text className="mt-2 text-base text-white/40">
            Legg bort telefonen. Level up.
          </Text>
        </View>

        <View className="flex-1 px-8 pt-6 pb-8">
          <Text className="font-pixel text-sm text-white mb-6">
            Enter the Tower
          </Text>

          <View className="gap-4">
            <TextInput
              className="rounded-lg bg-dark-100 border-2 border-dark-50 px-5 py-4 text-base text-white"
              placeholder="E-post"
              placeholderTextColor="#555a62"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <TextInput
              className="rounded-lg bg-dark-100 border-2 border-dark-50 px-5 py-4 text-base text-white"
              placeholder="Passord"
              placeholderTextColor="#555a62"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            <TouchableOpacity
              className="mt-2 rounded-lg bg-primary-500 border-2 border-primary-700 py-5"
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text className="text-center font-pixel text-sm text-white">
                {isLoading ? "Vent..." : "Enter"}
              </Text>
            </TouchableOpacity>

            <View className="mt-4 flex-row justify-center gap-1">
              <Text className="text-white/25 text-base">Ny helt?</Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text className="font-bold text-primary-400 text-base">
                    Lag konto
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
