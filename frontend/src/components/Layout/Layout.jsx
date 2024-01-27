import Grid from "@mui/material/Grid"
import { Outlet } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Box from "@mui/material/Box"
import TopBar from "../TopBar/TopBar"
import PointOfSale from "../Pos/PointOfSale"

const defaultTheme = createTheme()

export default function Layout() {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={8} lg={9}>
        <TopBar />
        <main>
          <ThemeProvider theme={defaultTheme}>
            <Box
              component="main"
              sx={{
                display: "flex",
                flexGrow: 1,
                height: "90vh",
                overflow: "auto",
              }}>
              <Outlet />
            </Box>
          </ThemeProvider>
        </main>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <PointOfSale />
      </Grid>
    </Grid>
  )
}
