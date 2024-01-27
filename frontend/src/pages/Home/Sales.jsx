import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import SalesTable from "../../components/SalesTable/SalesTable"
import "../../App.css"

function Sales() {
  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <SalesTable />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Sales
