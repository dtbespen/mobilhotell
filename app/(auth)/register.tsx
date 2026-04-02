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
import { Link, router } from "expo-router";
import { useAuth } from "@/lib/auth";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Feil", "Vennligst fyll inn alle feltene");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Feil", "Passordene stemmer ikke overens");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Feil", "Passordet må være minst 6 tegn");
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);
    if (error) {
      Alert.alert("Registrering feilet", error.message);
    } else {
      Alert.alert(
        "Konto opprettet!",
        "Sjekk e-posten din for å bekrefte kontoen, eller logg inn direkte.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/join") }]
      );
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
            Registrer deg
          </Text>
          <Text className="mt-2 text-lg text-gray-500">
            Opprett en ny konto
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
              placeholder="Minst 6 tegn"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="mb-1 text-sm font-medium text-gray-700">
              Bekreft passord
            </Text>
            <TextInput
              className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base"
              placeholder="Gjenta passordet"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="mt-4 rounded-xl bg-primary-600 px-4 py-4"
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-semibold text-white">
              {isLoading ? "Oppretter konto..." : "Registrer deg"}
            </Text>
          </TouchableOpacity>

          <View className="mt-4 flex-row justify-center gap-1">
            <Text className="text-gray-500">Har du allerede konto?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="font-semibold text-primary-600">Logg inn</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
