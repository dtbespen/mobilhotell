import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-white p-8">
        <Text className="text-4xl">🤷</Text>
        <Text className="mt-4 text-xl font-bold text-gray-900">
          Denne siden finnes ikke
        </Text>
        <Link href="/" className="mt-4">
          <Text className="text-primary-600 font-semibold">
            Gå til forsiden
          </Text>
        </Link>
      </View>
    </>
  );
}
