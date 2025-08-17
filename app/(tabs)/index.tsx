import AnimeCard from "@/components/AnimeCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchAnimes } from "@/services/api";
import { getTrendingAnimes } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

const Home = () => {
  const router = useRouter();

  const {
    data: animes,
    loading,
    error,
  } = useFetch(() => fetchAnimes({ orderBy: "score" }));

  const {
    data: trendingAnimes,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingAnimes);

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
        {/* logo */}
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        <View className="flex-1 mt-5">
          <SearchBar
            onPress={() => router.push("/search")}
            placeholder="Search for anime"
          />

          <View className="mt-5">
            {loading || trendingLoading ? (
              <ActivityIndicator
                size="large"
                color="#000ff"
                className="mt-10 self-center"
              />
            ) : error || trendingError ? (
              <Text>Error: {error?.message || trendingError?.message}</Text>
            ) : (
              <View>
                {trendingAnimes && trendingAnimes?.length > 0 && (
                  <Text className="text-white text-xl mb-3 font-bold">
                    Trending Searches
                  </Text>
                )}

                <FlatList
                  data={trendingAnimes}
                  renderItem={({ item, index }) => (
                    <TrendingCard anime={item} index={index + 1} />
                  )}
                  keyExtractor={(item) => item.animeId.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-3" />}
                />

                <Text className="text-white text-xl mt-6 mb-3 font-bold">
                  Most Popular
                </Text>

                <FlatList
                  data={animes}
                  renderItem={({ item, index }) => <AnimeCard {...item} />}
                  keyExtractor={(item) => item.mal_id.toString()}
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
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
