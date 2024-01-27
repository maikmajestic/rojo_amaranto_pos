import { useState } from 'react'
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import CardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CardHeader from '@mui/material/CardHeader'
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import axios from "axios"
import { currencyFormat } from "../utils/currencyFormat"

import EditProduct from '../EditProduct/EditProduct'
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

export default function ProductCard({ dataProduct }) {
  const [qnt, setQnt] = useState(1);
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleQuantity = (e) => {
    setQnt(e.target.value);
  }

  const handleSelection = () => {
    const selectedProduct = ({
      name: dataProduct.product_name,
      quantity: qnt,
      price: dataProduct.product_price,
      total: dataProduct.product_price * qnt
    });

    axios.post("http://localhost:8081/addCart", selectedProduct)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err))
  }

  const handleDeleteProduct = () => {
    axios.delete("http://localhost:8081/deleteProduct/" + dataProduct.id_product)
      .then(window.location.reload())
      .catch((err) => console.log(err))
  }

  return (
    <Card sx={{ maxWidth: '100%', width: '245px', opacity: dataProduct.product_status === 'Agotado' ? 0.5 : 1 }} className={styles.cardProduct}>
      <CardHeader
        className={styles.cardProductHeader}
        action={
          <>
            <DeleteIcon className={styles.deleteProduct} onClick={handleDeleteProduct} />
            <EditIcon className={styles.editProduct} onClick={handleOpen}/>
          </>
        }
      />
      <CardMedia
        sx={{ height: 140 }}
        image={"../../../" + dataProduct?.product_image}
        title={dataProduct?.product_name}
      />
      <CardContent>
        <Typography variant="h6" className={styles.productTitle}>
          {dataProduct.product_name}
        </Typography>
        <Typography className={styles.productCategory} variant="caption" color="text.secondary" sx={{ mb: 3, textTransform: 'capitalize'}}>
          Categoría: {dataProduct.product_type}
        </Typography>
        <Typography className={styles.productDescription} variant="body2" color="text.secondary">
          {dataProduct.product_description}
        </Typography>
        <Typography variant="h5" mt={3} className={styles.productPrice}>
          {currencyFormat(dataProduct.product_price)}
        </Typography>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <TextField onChange={handleQuantity} variant="outlined" label="Cantidad" type='number' value={qnt} disabled={dataProduct.product_status === 'Agotado' ? true : false}/>
        <Button color="success" size="large" variant="contained" onClick={handleSelection} disabled={dataProduct.product_status === 'Agotado' ? true : false}>Agregar</Button>
      </CardActions>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <EditProduct product={dataProduct}/>
        </Box>
      </Modal>
    </Card>
  )
}
