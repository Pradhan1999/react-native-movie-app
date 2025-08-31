import { Search } from "lucide-react-native";
import React from "react";
import { TextInput, View } from "react-native";

interface SearchBarProps {
  search?: string;
  setSearch?: (text: string) => void;
  onPress?: () => void;
  placeholder?: string;
  [key: string]: any;
}

const SearchBar = ({
  search,
  setSearch,
  onPress,
  placeholder,
  ...props
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Search color="#ab8bff" size={20} />
      <TextInput
        {...props}
        autoFocus={true}
        onPress={onPress}
        placeholder={placeholder || "Search"}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#a8b5db"
        className="flex-1 text-white ml-2"
      />
    </View>
  );
};

export default SearchBar;
