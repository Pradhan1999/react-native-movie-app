import AnimeCard from "@/components/AnimeCard";
import { images } from "@/constants/images";
import { getBookmarkedAnimes } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

const Saved = () => {
  const {
    data: bookmarkedAnimes,
    loading,
    error,
    refetch,
  } = useFetch(getBookmarkedAnimes);

  useFocusEffect(
    useCallback(() => {
      refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  return (
    <View className="flex-1 bg-primary">
      {/* Background img */}
      <Image source={images.bg} className="absolute w-full z-0" />

      {/* main container */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Text className="text-white text-2xl font-bold mt-20 mb-5">
          Saved Animes
        </Text>

        <View className="flex-1">
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#000ff"
              className="mt-10 self-center"
            />
          ) : error ? (
            <Text className="text-white text-center mt-10">
              Error: {error.message}
            </Text>
          ) : !bookmarkedAnimes || bookmarkedAnimes.length === 0 ? (
            <Text className="text-white text-center mt-10">
              No bookmarked animes yet
            </Text>
          ) : (
            <FlatList
              data={bookmarkedAnimes}
              renderItem={({ item }) => (
                <AnimeCard
                  mal_id={item.animeId}
                  title={item.title}
                  images={{
                    jpg: {
                      image_url: item.posterUrl,
                      small_image_url: "",
                      large_image_url: "",
                    },
                    webp: {
                      image_url: item.posterUrl,
                      small_image_url: "",
                      large_image_url: "",
                    },
                  }}
                  score={item.score}
                  aired={{
                    from: item.aired,
                    to: "",
                    prop: {
                      from: item.aired,
                      to: item.aired,
                    },
                    string: "",
                  }}
                  episodes={item.episodes}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Saved;
