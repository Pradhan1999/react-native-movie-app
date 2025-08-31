import AnimeCard from "@/components/AnimeCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchAnimes } from "@/services/api";
import { trackSearch } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Keyboard, Text, View } from "react-native";

const Search = () => {
  const searchInputRef = React.useRef<any>(null);
  const [searchText, setSearchText] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const {
    data: animes,
    loading,
    error,
    refetch,
    reset,
  } = useFetch(
    () => fetchAnimes({ orderBy: "popularity", keyword: searchText }),
    false
  );

  useEffect(() => {
    // const result = trackSearch(searchText, animes?.[0]);

    const timeOutId = setTimeout(async () => {
      if (searchText.trim()) {
        await refetch();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeOutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    if (animes && animes.length > 0 && searchText.trim()) {
      trackSearch(searchText, animes[0]);
    }
  }, [searchText, animes]);

  // Auto-focus the search input when screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary">
      {/* Background img */}
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={animes}
        renderItem={({ item }) => <AnimeCard {...item} />}
        keyExtractor={(item) => item.mal_id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="flex-row mt-20 w-full justify-center">
              <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />
            </View>
            <View className="my-5">
              <SearchBar
                ref={searchInputRef}
                search={searchText}
                setSearch={(text) => setSearchText(text)}
                placeholder="Search for anime"
                autoFocus={true}
                returnKeyType="search"
                onSubmitEditing={dismissKeyboard}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#000ff"
                className="mt-10 self-center"
              />
            )}

            {error && (
              <Text className="text-red-500 px-3 my-3">{error?.message}</Text>
            )}

            {!loading &&
              !error &&
              searchText.trim() !== "" &&
              animes &&
              animes?.length > 0 && (
                <Text className="text-xl text-white mb-3 font-bold">
                  Search results for:{" "}
                  <Text className="text-accent">{searchText}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading &&
          !error &&
          searchText.trim() !== "" &&
          animes?.length === 0 ? (
            <View className="mt-20 px-5 z-20">
              <Text className="text-white text-center">
                No results found for:{" "}
                <Text className="text-accent">{searchText}</Text>
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
