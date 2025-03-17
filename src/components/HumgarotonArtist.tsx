import { useEffect, useRef, useState } from "react";
import { fetchArtists } from "@/pages/api/api";
import { useRouter } from "next/router";
import { FetchArtistsParams } from "@/type/FetchArtistsParams";
import { ResponseArtists } from "@/type/ResponseArtists";
import Table from "./Table";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";

const ArtistList = () => {
  const router = useRouter();
  const { query } = router;
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<FetchArtistsParams>({ ...query, page });
  console.log(page,filters)

  const [artists, setArtists] = useState<ResponseArtists[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState< Error |null |undefined>(null);
  const [showFilter, setShowFilter] = useState<boolean>(true);

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
      if (type && type !== "") newFilters.type = type as FetchArtistsParams["type"];
      if (includeImage) newFilters.include_image = includeImage;
      
    }

    setFilters(newFilters);
    setPage(1);
  }
  useEffect(() => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
  }, [page]);

  useEffect(() => {
    const getArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArtists(filters);
        setArtists(data.data || []);
        router.push(
          {
            pathname: router.pathname,
            query: { ...filters, page },
          },
          undefined,
          { shallow: true }
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching artists:", error);
          setError(error);
        } else {
          console.error("Unknown error:", error);
        }
      }
      setLoading(false);
    };

    getArtists();
  }, [filters, router]);

  function cleanHandler() {
    if (customForm.current) {
      customForm.current.reset();
    }
    setFilters({ page: 1 });
    setPage(1);
    router.push({
      pathname: router.pathname,
      query: { page: 1 }
    });
  }

  return (
    <div className="margin-top-10">
      <Button id="phoneFilter" variant="contained" onClick={() => setShowFilter(!showFilter)}>
        {showFilter ? <>⬆️ Collapse Filters ⬆️</> : <>⬇️ Expand Filters ⬇️</>}
      </Button>
      {showFilter &&
        <Box component="form" onSubmit={handleSave} ref={customForm} autoComplete="off">
          <TextField
            className="margin-top-10"
            id="search"
            label="Search"
            variant="filled"
            defaultValue={query.search || ""}
            fullWidth
          />

          <TextField
            className="margin-top-10"
            id="letter"
            label="Letter"
            variant="filled"
            inputProps={{ maxLength: 1 }}
            defaultValue={query.letter || ""}
            fullWidth
          />

          <TextField
            className="margin-top-10"
            id="type"
            select
            label="Type"
            defaultValue={query.type || ""}
            variant="filled"
            fullWidth
          >
            <MenuItem value="">Select type</MenuItem>
            <MenuItem value="is_composer">Composer</MenuItem>
            <MenuItem value="is_performer">Performer</MenuItem>
            <MenuItem value="is_primary">Primary</MenuItem>
          </TextField>

          <FormControlLabel
            label="Include Image"
            control={<Checkbox id="include_image" defaultChecked={query.include_image === "true"} />}
          />

          <Stack spacing={2} direction="row" className="flex-center">
            <Button type="submit" variant="contained">🔎 Filter</Button>
            <Button variant="contained" onClick={cleanHandler}>🧽 Clear</Button>
          </Stack>
        </Box>
      }
      <div className="margin-top-15">
        {error && <p>{error.message}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : artists.length === 0 ? (
          <p>No artists found.</p>
        ) : (
          <Table artists={artists} />
        )}

        <Stack spacing={2} direction="row" className="flex-center margin-top-15">
          {page > 1 && (
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => prev - 1)}
            >
              {page - 1}
            </Button>
          )}
          <Button variant="contained">{page}</Button>
          {artists.length >= 50 &&
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => prev + 1)}
            >
              {page + 1}
            </Button>
          }
        </Stack>
      </div>
    </div>
  );
};

export default ArtistList;
