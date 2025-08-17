import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface SearchBarProps {
  search?: string;
  setSearch?: (text: string) => void;
  onPress?: () => void;
  placeholder?: string;
}

const SearchBar = ({
  search,
  setSearch,
  onPress,
  placeholder,
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder || "Search"}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#a8b5db"
        className="flex-1 text-white ml-3"
      />
    </View>
  );
};

export default SearchBar;
