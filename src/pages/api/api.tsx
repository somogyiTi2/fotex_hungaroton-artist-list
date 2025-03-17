import { FetchArtistsParams } from "@/type/FetchArtistsParams";
import axios from "axios";
const API_URL: string = process.env.NEXT_PUBLIC_API_URL; 

export const fetchArtists = async (params: FetchArtistsParams) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        ...params,
        per_page: 50, // Fix érték
      },
    });
    console.log("Artists API Response:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
};
