import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
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
      Alert.alert("Feil", "Vennligst fyll inn e-post og passord");
      return;
    }
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      Alert.alert("Innlogging feilet", error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        <View className="mb-12 items-center">
          <Text className="text-4xl font-bold text-primary-600">
            Mobilhotell
          </Text>
          <Text className="mt-2 text-lg text-gray-500">
            Samle poeng for god skjermtid
          </Text>
        </View>

        <View className="gap-4">
          <View>
            <Text className="mb-1 text-sm font-medium text-gray-700">
              E-post
            </Text>
            <TextInput
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base"
              placeholder="din@epost.no"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="mb-1 text-sm font-medium text-gray-700">
              Passord
            </Text>
            <TextInput
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base"
              placeholder="Ditt passord"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            className="mt-4 rounded-xl bg-primary-600 px-4 py-4"
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-semibold text-white">
              {isLoading ? "Logger inn..." : "Logg inn"}
            </Text>
          </TouchableOpacity>

          <View className="mt-4 flex-row justify-center gap-1">
            <Text className="text-gray-500">Har du ikke konto?</Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="font-semibold text-primary-600">
                  Registrer deg
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
