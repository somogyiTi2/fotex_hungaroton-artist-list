export type FetchArtistsParams = {
    page: number;
    search?: string;
    letter?: string;
    type?: "is_composer" | "is_performer" | "is_primary";
    include_image?: boolean;
  };