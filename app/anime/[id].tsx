import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { Anime } from "@/interfaces/interfaces";
import { fetchAnimeDetails } from "@/services/api";
import { bookmarkAnime, getBookmarkedAnimes } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { ArrowLeft, Heart } from "lucide-react-native";

interface AnimeInfoProps {
  label: string;
  value?: string | number | null;
}

const AnimeInfo = ({ label, value }: AnimeInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const AnimeDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const { data: anime, loading } = useFetch(() =>
    fetchAnimeDetails(id as unknown as number)
  ) as { data: Anime; loading: boolean };

  // Check if anime is bookmarked when component loads
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const bookmarkedAnimes = await getBookmarkedAnimes();
        const isAnimeBookmarked = bookmarkedAnimes.some(
          (bookmark) => bookmark.animeId === Number(id)
        );
        setIsBookmarked(isAnimeBookmarked);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };
    checkBookmarkStatus();
  }, [id]);

  const handleBookmark = async () => {
    try {
      if (!anime) return;
      const bookmarked = await bookmarkAnime(anime);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error("Error bookmarking anime:", error);
    }
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Image banner and play button */}
        <View>
          <Image
            source={{
              uri: anime?.images?.jpg?.large_image_url,
            }}
            className="w-full h-[520px]"
            resizeMode="stretch"
          />

          <TouchableOpacity
            className="absolute bottom-5 right-20 rounded-full size-14 bg-white flex items-center justify-center"
            onPress={handleBookmark}
          >
            <Heart size={22} fill={isBookmarked ? "#EF4444" : "none"} />
          </TouchableOpacity>
          <TouchableOpacity className="absolute bottom-5 right-4 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5 mb-5">
          {/* Title & Episodes */}
          <Text className="text-white font-bold text-xl">
            {anime?.title_english}
          </Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {anime?.aired?.from?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">
              {anime?.episodes} Episodes
            </Text>
          </View>

          {/* Rating & Votes */}

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(anime?.score ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({anime?.scored_by} votes)
            </Text>
          </View>

          {/* Synopsis */}
          <AnimeInfo label="Overview" value={anime?.synopsis} />

          <AnimeInfo
            label="Genres"
            value={anime?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          {/* <View className="flex flex-row justify-between w-1/2">
            <AnimeInfo
              label="Budget"
              value={`$${(anime?.budget ?? 0) / 1_000_000} million`}
            />
            <AnimeInfo
              label="Revenue"
              value={`$${Math.round(
                (anime?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View> */}

          <AnimeInfo
            label="Production Companies"
            value={anime?.producers?.map((c) => c.name).join(" • ") || "N/A"}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50 gap-2"
        onPress={router.back}
      >
        <ArrowLeft size={22} color="#fff" />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AnimeDetails;
