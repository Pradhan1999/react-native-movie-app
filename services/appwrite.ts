// Track the searches made by the user

import { Anime } from "@/interfaces/interfaces";
import { Client, Databases, ID, Query } from "react-native-appwrite";

const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const PROJECTID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASEID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTIONID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
const BOOKMARKS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_BOOKMARKS_COLLECTION_ID;

if (
  !ENDPOINT ||
  !PROJECTID ||
  !DATABASEID ||
  !COLLECTIONID ||
  !BOOKMARKS_COLLECTION_ID
) {
  throw new Error("One or more required environment variables are missing.");
}

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECTID);

const database = new Databases(client);

export const trackSearch = async (query: string, anime: Anime) => {
  try {
    const result = await database.listDocuments(DATABASEID, COLLECTIONID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingRecord = result.documents[0];

      await database.updateDocument(
        DATABASEID,
        COLLECTIONID,
        existingRecord.$id,
        {
          count: existingRecord.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASEID, COLLECTIONID, ID.unique(), {
        searchTerm: query,
        count: 1,
        animeId: anime?.mal_id,
        title: anime?.title_english || anime?.title,
        posterUrl: anime?.images?.jpg?.image_url,
      });
    }
  } catch (error) {
    console.error("Error tracking search:", error);
    throw error;
  }
};

export const getTrendingAnimes = async () => {
  try {
    const result = await database.listDocuments(DATABASEID, COLLECTIONID, [
      Query.orderDesc("count"),
      Query.limit(5),
    ]);

    return result.documents.map((doc) => ({
      searchTerm: doc.searchTerm,
      count: doc.count,
      animeId: doc.animeId,
      title: doc.title,
      posterUrl: doc.posterUrl,
    }));
  } catch (error) {
    console.error("Error fetching trending animes:", error);
    throw error;
  }
};

export const bookmarkAnime = async (anime: any) => {
  try {
    const result = await database.listDocuments(
      DATABASEID,
      BOOKMARKS_COLLECTION_ID,
      [Query.equal("animeId", anime.mal_id)]
    );

    if (result.documents.length > 0) {
      // Already bookmarked - remove it
      await database.deleteDocument(
        DATABASEID,
        BOOKMARKS_COLLECTION_ID,
        result.documents[0].$id
      );
      return false; // Return false to indicate bookmark was removed
    } else {
      // Add new bookmark
      await database.createDocument(
        DATABASEID,
        BOOKMARKS_COLLECTION_ID,
        ID.unique(),
        {
          animeId: anime.mal_id,
          title: anime.title_english || anime.title,
          posterUrl: anime.images?.jpg?.image_url,
          score: Number(anime.score),
          aired: anime.aired?.from,
          episodes: anime.episodes,
        }
      );
      return true; // Return true to indicate bookmark was added
    }
  } catch (error) {
    console.error("Error bookmarking anime:", error);
    throw error;
  }
};

export const getBookmarkedAnimes = async () => {
  try {
    const result = await database.listDocuments(
      DATABASEID,
      BOOKMARKS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")]
    );

    return result.documents.map((doc) => ({
      id: doc.$id,
      animeId: doc.animeId,
      title: doc.title,
      posterUrl: doc.posterUrl,
      score: doc.score,
      aired: doc.aired,
      episodes: doc.episodes,
    }));
  } catch (error) {
    console.error("Error fetching bookmarked animes:", error);
    throw error;
  }
};
