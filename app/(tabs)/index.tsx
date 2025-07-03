import AnimeCard from "@/components/AnimeCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchAnimes } from "@/services/api";
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

  const { data: animes, loading, error } = useFetch(() => fetchAnimes({}));

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
            placeholder="Search for a anime"
          />

          <View className="mt-5">
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#000ff"
                className="mt-10 self-center"
              />
            ) : error ? (
              <Text>Error: {error.message}</Text>
            ) : (
              <View>
                <FlatList
                  data={animes}
                  renderItem={({ item }) => <AnimeCard {...item} />}
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
                {/* {animes?.map((anime) => (
                  <View
                    key={anime.mal_id}
                    className="bg-white p-4 rounded-lg mb-4 shadow"
                  >
                    <Text className="text-lg font-bold">{anime.title}</Text>
                    <Text className="text-gray-600">{anime.source}</Text>
                  </View>
                ))} */}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
