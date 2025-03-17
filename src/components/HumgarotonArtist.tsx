import { useEffect, useState } from "react";
import { fetchArtists } from "@/pages/api/api";

interface Artist {
  id: number;
  name: string;
  portrait?: string;
  albumCount: number;
}

const ArtistList = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const getArtists = async () => {
      setLoading(true);
      try {
        const data = await fetchArtists({ page });
        setArtists(data.data || []);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
      setLoading(false);
    };
    getArtists();
  }, [page]);

  return (
    <div>
      {loading ? <p>Loading...</p> : artists.map((artist) => (
        <div key={artist?.id}>
          {artist.portrait &&
            <img src={artist.portrait} alt={artist.name} width={100} />
          }
          <h3>{artist.name}</h3>
          <p>Albumok száma: {artist.albumCount}</p>
        </div>
      ))}
      <button onClick={() => setPage((prev) => prev + 1)}>Következő oldal</button>
    </div>
  );
};

export default ArtistList;
