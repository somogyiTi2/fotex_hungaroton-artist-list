import React from 'react';
import { ResponseArtists } from "@/type/ResponseArtists";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar } from '@mui/material';

const ArtistTable: React.FC<{artists: ResponseArtists[];}> = ({ artists }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="artists table">
        <TableHead>
          <TableRow>
            <TableCell>Portrait</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Album Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {artists.map((artist) => (
            <TableRow key={artist.id}>
              <TableCell>
                {artist.portrait ? (
                  <Avatar src={artist.portrait} alt={artist.name} />
                ) : (
                  <Avatar>{artist.name.charAt(0)}</Avatar>
                )}
              </TableCell>
              <TableCell>{artist.name}</TableCell>
              <TableCell align="right">{artist.albumCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArtistTable;
