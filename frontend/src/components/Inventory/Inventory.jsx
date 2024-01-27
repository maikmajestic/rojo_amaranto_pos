import { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import ProductCard from "./ProductCard"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import InputAdornment from "@mui/material/InputAdornment"
import FormControl from "@mui/material/FormControl"
import SearchIcon from "@mui/icons-material/Search"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"
import ReactPaginate from "react-paginate"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"

import UploadProduct from "../UploadProduct/UploadProduct"
import styles from "./ProductCard.module.scss"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

export default function Inventory() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [data, setData] = useState()
  const [search, setSearch] = useState("")
  const [itemsPerPage] = useState(14)

  const handleSearch = (e) => {
    const search = e.target.value
    setSearch(search.toLowerCase())
  }

  const Items = ({ currentItems }) => {
    return (
      <div className={styles.inventoryContainer}>
        {currentItems &&
          currentItems.map((product) => (
            <ProductCard key={product.id_product} dataProduct={product} />
          ))}
      </div>
    )
  }

  const PaginatedItems = ({ itemsPerPage }) => {
    const [itemOffset, setItemOffset] = useState(0)

    const endOffset = itemOffset + itemsPerPage
    const currentItems = data?.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(data?.length / itemsPerPage)

    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % data?.length
      setItemOffset(newOffset)
    }

    return (
      <>
        <Items currentItems={currentItems} />
        {data?.length > itemsPerPage && (
          <ReactPaginate
            breakLabel="..."
            nextLabel={<NavigateNextIcon />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={<NavigateBeforeIcon />}
            renderOnZeroPageCount={null}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        )}
      </>
    )
  }

  useEffect(() => {
    fetch("http://localhost:8081/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((product) =>
          product.product_name.includes(search) || product.product_type.includes(search)
        );
        setData(filtered)
      })
      .catch((err) => console.error(err))
  }, [search])

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
        }}>
        <Grid container spacing={3} className={styles.inventoryPage}>
          <Grid item xs={12} md={10}>
            <FormControl fullWidth variant="standard">
              <TextField
                id="standard-start-adornment"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                onChange={handleSearch}
              />
            </FormControl>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <Button variant="contained" size="large" fullWidth onClick={handleOpen}>
              Agregar Producto
            </Button>
          </Grid>
        </Grid>
        <Grid container sx={{ mt:2 }}>
          <Grid item xs={12}>
            <PaginatedItems itemsPerPage={itemsPerPage} />
          </Grid>
        </Grid>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <UploadProduct />
        </Box>
      </Modal>
    </>
  )
}
