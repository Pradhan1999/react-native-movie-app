import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  anime: {
    title: string;
    posterUrl: string;
  };
  index?: number;
}

const TrendingCard = ({ anime: { title, posterUrl }, index }: CardProps) => {
  return (
    <Link href="/" asChild>
      <TouchableOpacity className="w-36 pl-5">
        <View className="mb-3 relative">
          <Image
            source={{
              uri: posterUrl
                ? `${posterUrl}`
                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
            }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
          />

          <View className="absolute top-1 left-1 bg-accent p-1.5 rounded-full">
            <Text className="text-white">#{index}</Text>
          </View>
          <View className="">
            <Text
              className="text-sm font-bold text-white mt-2"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
