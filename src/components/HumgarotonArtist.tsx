import { useEffect, useRef, useState } from "react";
import { fetchArtists } from "@/pages/api/api";
import { useRouter } from "next/router";
import { FetchArtistsParams } from "@/type/FetchArtistsParams";
import { ResponseArtists } from "@/type/ResponseArtists";

const ArtistList = () => {
  const router = useRouter();
  const { query } = router;
  const [page, setPage] = useState<number>(query.page ? parseInt(query.page as string) : 1);
  const [filters, setFilters] = useState<FetchArtistsParams>({ ...query, page });

  const [artists, setArtists] = useState<ResponseArtists[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const customForm = useRef<HTMLFormElement>(null);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const form = customForm.current;
    const newFilters: FetchArtistsParams = { page: 1 }; 

    if (form) {

      const search = (form.elements.namedItem('search') as HTMLInputElement)?.value.trim();
      const letter = (form.elements.namedItem('letter') as HTMLInputElement)?.value.trim();
      const type = (form.elements.namedItem('type') as HTMLInputElement)?.value;
      const includeImage = (form.elements.namedItem('include_image') as HTMLInputElement)?.checked;

      if (search) newFilters.search = search;
      if (letter) newFilters.letter = letter;
      if (type as FetchArtistsParams["type"]) newFilters.type = type;
      if (includeImage) newFilters.include_image = includeImage;
    }

    setFilters(newFilters);
    setPage(1); 
  }


  useEffect(() => {
    const getArtists = async () => {
      setLoading(true);
      try {
        const data = await fetchArtists(filters);
        setArtists(data.data || []);
        router.push({
          pathname: router.pathname,
          query: { ...filters, page },
        }, undefined, { shallow: true });   
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
      setLoading(false);
    };

    getArtists();
  }, [filters]);

  return (
    <div>
      <form onSubmit={handleSave} ref={customForm}>
        <label>
          Search
          <input type="text" id="search" defaultValue={query.search ? query.search as string : ""} />
        </label>
        <label>
          Letter
          <input type="text" id="letter" maxLength={1} defaultValue={query.letter ? query.letter as string : ""} />
        </label>
        <label>
          Type
          <select id="type" defaultValue={query.type ? query.type as string : ""}>
            <option value="">Select type</option>
            <option value="is_composer">Composer</option>
            <option value="is_performer">Performer</option>
          </select>
        </label>
        <label>
          Include Image
          <input
            type="checkbox"
            name="include_image"
            id="include_image"
            defaultChecked={query.include_image === "true"}
          />
        </label>
        <button>🔎 Filter</button>
      </form>

      {loading ? <p>Loading...</p> : artists.map((artist) => (
        <div key={artist?.id}>
          {artist.portrait &&
            <img src={artist.portrait} alt={artist.name} width={100} />
          }
          <h3>{artist.name}</h3>
          <p>Albumok száma: {artist.albumCount}</p>
        </div>
      ))}

      <div>
        {page > 1 && <button onClick={() => setPage((prev) => prev - 1)}>{page - 1}</button>}
        {page}
        <button onClick={() => setPage((prev) => prev + 1)}>{page + 1}</button>
      </div>
    </div>
  );
};

export default ArtistList;
