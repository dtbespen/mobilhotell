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
      Alert.alert("Oops!", "Du glemte e-post eller passord");
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
      className="flex-1 bg-primary-500"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-20 pb-10 px-8">
          <Text style={{ fontSize: 72 }}>🔌</Text>
          <Text className="mt-3 text-5xl font-bold text-white tracking-tight">
            Unplug
          </Text>
          <Text className="mt-2 text-base font-medium text-white/60">
            Legg vekk telefonen. Tjen rewards.
          </Text>
        </View>

        <View className="flex-1 rounded-t-[36px] px-8 pt-10 pb-8 bg-dark-300">
          <Text className="text-xl font-bold text-white mb-6">
            Velkommen tilbake!
          </Text>

          <View className="gap-4">
            <TextInput
              className="rounded-2xl bg-dark-100 px-5 py-4 text-base text-white"
              placeholder="E-post"
              placeholderTextColor="#555a62"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <TextInput
              className="rounded-2xl bg-dark-100 px-5 py-4 text-base text-white"
              placeholder="Passord"
              placeholderTextColor="#555a62"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            <TouchableOpacity
              className="mt-2 rounded-2xl bg-primary-500 py-5"
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text className="text-center text-lg font-bold text-white">
                {isLoading ? "Vent litt..." : "Let's go! 🚀"}
              </Text>
            </TouchableOpacity>

            <View className="mt-4 flex-row justify-center gap-1">
              <Text className="text-white/25 text-base">Ny her?</Text>
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
