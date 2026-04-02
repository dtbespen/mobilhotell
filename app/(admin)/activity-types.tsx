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
import { PixelCard } from "@/components/ui/PixelCard";

const CATEGORIES = [
  { value: "screen_free", label: "Skjermfri", emoji: "\u{1F4F5}" },
  { value: "reading", label: "Lesing", emoji: "\u{1F4DA}" },
  { value: "creating", label: "Kreativt", emoji: "\u{1F3A8}" },
  { value: "custom", label: "Annet", emoji: "\u2B50" },
];

export default function QuestTypesScreen() {
  const { activityTypes, addActivityType, deleteActivityType } =
    useActivityTypes();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("custom");
  const [newPoints, setNewPoints] = useState("1");

  async function handleAdd() {
    if (!newName) {
      Alert.alert("Feil", "Gi questen et navn");
      return;
    }
    const pts = parseFloat(newPoints);
    if (isNaN(pts) || pts <= 0) {
      Alert.alert("Feil", "Oppgi gyldige Mana per minutt");
      return;
    }

    const { error } = await addActivityType({
      name: newName,
      category: newCategory,
      points_per_minute: pts,
      icon: CATEGORIES.find((c) => c.value === newCategory)?.emoji ?? "\u2B50",
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
    Alert.alert("Slett quest type", `Vil du slette "${name}"?`, [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Slett",
        style: "destructive",
        onPress: () => deleteActivityType(id),
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row items-center gap-3 mb-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-2xl text-primary-400">{"\u2190"}</Text>
            </TouchableOpacity>
            <Text className="font-pixel text-sm text-white">Quest Types</Text>
          </View>
          <Text className="text-white/30 text-sm">
            Definer hvilke quests som gir Mana
          </Text>
        </View>

        <View className="mt-4 px-5 gap-3">
          {activityTypes.map((type) => (
            <PixelCard key={type.id} className="flex-row items-center py-3">
              <Text className="text-2xl mr-3">
                {CATEGORIES.find((c) => c.value === type.category)?.emoji ??
                  "\u2B50"}
              </Text>
              <View className="flex-1">
                <Text className="font-bold text-white">{type.name}</Text>
                <Text className="text-xs text-white/30">
                  {type.points_per_minute} Mana/min{" "}
                  {type.is_default ? "\u00b7 Standard" : "\u00b7 Egendefinert"}
                </Text>
              </View>
              {!type.is_default && (
                <TouchableOpacity
                  onPress={() => handleDelete(type.id, type.name)}
                  className="ml-2 rounded-md bg-danger-500/10 border border-danger-500/20 px-3 py-1.5"
                >
                  <Text className="text-sm text-danger-400">Slett</Text>
                </TouchableOpacity>
              )}
            </PixelCard>
          ))}
        </View>

        <View className="px-5 mt-6 pb-8">
          <TouchableOpacity
            className="rounded-lg bg-primary-500 border-2 border-primary-700 py-4"
            onPress={() => setShowAdd(true)}
            activeOpacity={0.8}
          >
            <Text className="text-center font-pixel text-xs text-white">
              + Ny Quest Type
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
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-[24px] bg-dark-200 px-6 pb-10 pt-6 border-t-2 border-dark-50">
            <Text className="font-pixel text-sm text-white">
              Ny Quest Type
            </Text>

            <View className="mt-4">
              <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                Navn
              </Text>
              <TextInput
                className="rounded-lg bg-dark-100 border-2 border-dark-50 px-4 py-3 text-base text-white"
                placeholder="F.eks. Puslespill"
                placeholderTextColor="#555a62"
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            <View className="mt-4">
              <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                Kategori
              </Text>
              <View className="flex-row gap-2">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    className={`flex-1 items-center rounded-lg py-3 border-2 ${
                      newCategory === cat.value
                        ? "bg-primary-500/15 border-primary-500/30"
                        : "bg-dark-100 border-dark-50"
                    }`}
                    onPress={() => setNewCategory(cat.value)}
                  >
                    <Text className="text-lg">{cat.emoji}</Text>
                    <Text className="text-[10px] text-white/40 mt-1">
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-4">
              <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                Mana per minutt
              </Text>
              <TextInput
                className="rounded-lg bg-dark-100 border-2 border-dark-50 px-4 py-3 text-center text-xl font-bold text-accent-400"
                placeholder="1"
                placeholderTextColor="#555a62"
                value={newPoints}
                onChangeText={setNewPoints}
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-lg bg-dark-100 border-2 border-dark-50 py-3"
                onPress={() => setShowAdd(false)}
              >
                <Text className="text-center font-bold text-white/30">
                  Avbryt
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg bg-primary-500 border-2 border-primary-700 py-3"
                onPress={handleAdd}
              >
                <Text className="text-center font-pixel text-xs text-white">
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
