import Box from "@mui/material/Box"
import InputAdornment from "@mui/material/InputAdornment"
import FormControl from "@mui/material/FormControl"
import SearchIcon from "@mui/icons-material/Search"
import TextField from '@mui/material/TextField';

export default function SearchField() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
      }}>
      <FormControl fullWidth sx={{ mb: 2 }} variant="standard">
        <TextField
          id="standard-start-adornment"
          sx={{ m: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon/>
              </InputAdornment>
            ),
          }}
          variant="standard"
        />
      </FormControl>
    </Box>
  )
}
