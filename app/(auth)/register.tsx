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
      Alert.alert("Oops!", "Fyll inn alle feltene da vel");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hmm...", "Passordene matcher ikke. Prøv igjen!");
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
        "Du er inne! 🎉",
        "Sjekk e-posten din, eller bare logg rett inn.",
        [{ text: "Nice!", onPress: () => router.replace("/(auth)/join") }]
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-accent-500"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-16 pb-6 px-8">
          <Text style={{ fontSize: 56 }}>⚡</Text>
          <Text className="mt-2 text-3xl font-bold text-white">
            Bli en Unplugger
          </Text>
          <Text className="mt-1 text-base text-white/50">
            Det tar 30 sekunder. Seriøst.
          </Text>
        </View>

        <View className="flex-1 rounded-t-[36px] px-8 pt-10 pb-8 bg-dark-300">
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
              placeholder="Lag et passord"
              placeholderTextColor="#555a62"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TextInput
              className="rounded-2xl bg-dark-100 px-5 py-4 text-base text-white"
              placeholder="Skriv passordet en gang til"
              placeholderTextColor="#555a62"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              className="mt-2 rounded-2xl bg-accent-500 py-5"
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text className="text-center text-lg font-bold text-white">
                {isLoading ? "Jobber med det..." : "Lag konto ⚡"}
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
