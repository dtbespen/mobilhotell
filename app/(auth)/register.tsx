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
      Alert.alert("Hei!", "Fyll inn alle feltene");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hmm...", "Passordene matcher ikke");
      return;
    }
    if (password.length < 6) {
      Alert.alert("For kort!", "Passordet trenger minst 6 tegn");
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);
    if (error) {
      Alert.alert("Noe gikk galt", error.message);
    } else {
      Alert.alert(
        "Du er inne! \u2728",
        "Sjekk e-posten din, eller logg rett inn.",
        [{ text: "Nice!", onPress: () => router.replace("/(auth)/join") }]
      );
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
        <View className="items-center pt-16 pb-6 px-8">
          <Text className="text-5xl">{"\u2728"}</Text>
          <Text className="font-pixel text-lg text-accent-400 mt-3">
            Create Your Hero
          </Text>
          <Text className="mt-1 text-base text-white/40">
            Det tar 30 sekunder.
          </Text>
        </View>

        <View className="flex-1 px-8 pt-6 pb-8">
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
              placeholder="Lag et passord"
              placeholderTextColor="#555a62"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TextInput
              className="rounded-lg bg-dark-100 border-2 border-dark-50 px-5 py-4 text-base text-white"
              placeholder="Bekreft passord"
              placeholderTextColor="#555a62"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              className="mt-2 rounded-lg bg-accent-500 border-2 border-accent-700 py-5"
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text className="text-center font-pixel text-sm text-white">
                {isLoading ? "Jobber..." : "Lag helt"}
              </Text>
            </TouchableOpacity>

            <View className="mt-4 flex-row justify-center gap-1">
              <Text className="text-white/25 text-base">Har konto?</Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="font-bold text-primary-400 text-base">
                    Logg inn
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
