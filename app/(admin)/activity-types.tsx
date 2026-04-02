import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useActivityTypes } from "@/hooks/useActivityTypes";

const CATEGORIES = [
  { value: "screen_free", label: "Skjermfri", emoji: "📵" },
  { value: "reading", label: "Lesing", emoji: "📚" },
  { value: "creating", label: "Kreativt", emoji: "🎨" },
  { value: "custom", label: "Annet", emoji: "⭐" },
];

export default function ActivityTypesScreen() {
  const { activityTypes, addActivityType, updateActivityType, deleteActivityType } =
    useActivityTypes();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("custom");
  const [newPoints, setNewPoints] = useState("1");

  async function handleAdd() {
    if (!newName) {
      Alert.alert("Feil", "Oppgi et navn");
      return;
    }
    const pts = parseFloat(newPoints);
    if (isNaN(pts) || pts <= 0) {
      Alert.alert("Feil", "Oppgi gyldige Plugs per minutt");
      return;
    }

    const { error } = await addActivityType({
      name: newName,
      category: newCategory,
      points_per_minute: pts,
      icon: CATEGORIES.find((c) => c.value === newCategory)?.emoji ?? "⭐",
    });

    if (error) {
      Alert.alert("Feil", error.message);
    } else {
      setShowAdd(false);
      setNewName("");
      setNewPoints("1");
    }
  }

  function handleDelete(id: string, name: string) {
    Alert.alert("Slett aktivitetstype", `Vil du slette "${name}"?`, [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: () => deleteActivityType(id),
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center gap-3 mb-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-2xl text-primary-600">←</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">
              Aktivitetstyper
            </Text>
          </View>
          <Text className="text-gray-500">
            Definer hvilke aktiviteter som gir Plugs
          </Text>
        </View>

        <View className="mt-4 px-6 gap-3">
          {activityTypes.map((type) => (
            <View
              key={type.id}
              className="flex-row items-center rounded-xl bg-white px-4 py-4 shadow-sm"
            >
              <Text className="text-2xl mr-3">
                {CATEGORIES.find((c) => c.value === type.category)?.emoji ?? "⭐"}
              </Text>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">{type.name}</Text>
                <Text className="text-xs text-gray-400">
                  {type.points_per_minute} Plugs/min •{" "}
                  {type.is_default ? "Standard" : "Egendefinert"}
                </Text>
              </View>
              {!type.is_default && (
                <TouchableOpacity
                  onPress={() => handleDelete(type.id, type.name)}
                  className="ml-2 rounded-lg bg-red-50 px-3 py-1.5"
                >
                  <Text className="text-sm text-red-600">Slett</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View className="px-6 mt-6 pb-8">
          <TouchableOpacity
            className="rounded-xl bg-primary-600 py-4"
            onPress={() => setShowAdd(true)}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-semibold text-white">
              + Legg til ny aktivitetstype
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showAdd}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAdd(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6">
            <Text className="text-xl font-bold text-gray-900">
              Ny aktivitetstype
            </Text>

            <View className="mt-4">
              <Text className="mb-1 text-sm font-medium text-gray-700">Navn</Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base"
                placeholder="F.eks. Puslespill"
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            <View className="mt-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Kategori
              </Text>
              <View className="flex-row gap-2">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    className={`flex-1 items-center rounded-xl py-3 ${
                      newCategory === cat.value
                        ? "bg-primary-100 border border-primary-300"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                    onPress={() => setNewCategory(cat.value)}
                  >
                    <Text className="text-lg">{cat.emoji}</Text>
                    <Text className="text-xs mt-1">{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-4">
              <Text className="mb-1 text-sm font-medium text-gray-700">
                Plugs per minutt
              </Text>
              <TextInput
                className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-center text-xl font-bold"
                placeholder="1"
                value={newPoints}
                onChangeText={setNewPoints}
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-xl border border-gray-300 py-3"
                onPress={() => setShowAdd(false)}
              >
                <Text className="text-center font-semibold text-gray-600">
                  Avbryt
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-xl bg-primary-600 py-3"
                onPress={handleAdd}
              >
                <Text className="text-center font-semibold text-white">
                  Legg til
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
