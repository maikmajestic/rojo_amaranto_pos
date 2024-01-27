import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Inventory from "../../components/Inventory/Inventory"
import "../../App.css"

function Home() {
  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Inventory />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Home
