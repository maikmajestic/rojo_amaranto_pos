import { useEffect, useState } from "react"
import axios from "axios"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import FormControl from "@mui/material/FormControl"
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import InputLabel from '@mui/material/InputLabel'

import { productTypes } from "../utils/categories"
import styles from "../UploadProduct/UploadProduct.module.scss"

export default function EditProduct({ product }) {
  const [file, setFile] = useState()
  const [productType, setProductType] = useState("")
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  })
  const [dataProduct, setDataProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
    type: "",
    status: ""
  })

  const handleFile = (e) => {
    setFile(e.target.files[0])
  }

  const handleStatus = (e) => {
    const status = e.target.value;
    setDataProduct({ ...dataProduct, status})
  }

  const handleDataProduct = (e) => {
    let value = e.target.value
    let prop = e.target.id
    setDataProduct({
      ...dataProduct,
      [prop]: value,
    })
  }

  const handleEdit = () => {
    const formData = new FormData()
    formData.append("image", file)
    axios
      .put("https://127.0.0.1:3306/editImage/" + dataProduct.id, formData)
      .then(() => {
        handleEditData(dataProduct.id)
      })
      .catch((err) => console.log(err))
  }

  const handleEditData = () => {
    axios
      .put("http://localhost:8081/editProduct/" + dataProduct.id, dataProduct)
      .then((res) => {
        if (res.status === 200) {
          setAlert({
            ...alert,
            status: "success",
            message: "Producto editado correctamente",
          })
          setDataProduct({})
          window.location.reload()
        } else {
          setAlert({
            ...alert,
            status: "error",
            message: "Ocurrió un error, vuelve a intentarlo",
          })
        }
      })
      .catch(() => {
        setAlert({
          ...alert,
          status: "error",
          message: "Ocurrió un error, vuelve a intentarlo",
        })
      })
  }

  useEffect(() => {
    setProductType(product.product_type)
    setDataProduct({
      ...dataProduct,
      id: product.id_product,
      name: product.product_name,
      description: product.product_description,
      price: product.product_price,
      type: product.product_type,
      status: product.product_status
    })
  }, [product])

  return (
    <Container maxWidth="xl" sx={{ mb: 2 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={12} lg={12}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { mt: 2, width: "100%" },
            }}
            noValidate
            autoComplete="off">
            <div>
              <h2 style={{ marginBottom: '2rem'}}>Editar Producto</h2>
            </div>
            <div>
              <TextField
                error={dataProduct.name === "" && true}
                helperText={
                  dataProduct.name === "" ? "Ingresa nombre del producto" : ""
                }
                id="name"
                label="Nombre"
                placeholder="Nombre del producto"
                multiline
                variant="filled"
                value={dataProduct.name}
                onChange={handleDataProduct}
              />
            </div>
            <div>
              <TextField
                error={dataProduct.description === "" && true}
                helperText={
                  dataProduct.description === ""
                    ? "Ingresa descripción del producto"
                    : ""
                }
                id="description"
                label="Descripción"
                placeholder="Descripción del producto"
                multiline
                variant="filled"
                value={dataProduct.description}
                onChange={handleDataProduct}
              />
            </div>
            <div>
              <FormControl variant="filled" fullWidth>
                <Autocomplete
                  disablePortal
                  fullWidth
                  id="type"
                  value={productType}
                  onChange={(event, newValue) => {
                    setProductType(newValue);
                    setDataProduct({...dataProduct, type: newValue});
                  }}
                  options={productTypes}
                  renderInput={(params) => <TextField {...params} label="Tipo de producto" variant="filled" />}
                />
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="filled" sx={{ mt: 2 }}>
                <InputLabel id="status">Estado de producto</InputLabel>
                <Select
                  value={dataProduct.status}
                  labelId="status"
                  id="status"
                  onChange={handleStatus}
                  label="Estado de producto"
                >
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Agotado">Agotado</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField
                error={dataProduct.price <= 0 && true}
                helperText={
                  dataProduct.price <= 0 ? "Ingresa precio del producto" : ""
                }
                id="price"
                label="Precio"
                placeholder="Precio del producto"
                variant="filled"
                type="number"
                value={dataProduct.price}
                onChange={handleDataProduct}
              />
            </div>
            <div className={styles.imgProduct}>
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "../../../" + product.product_image
                }
              />
              <input
                type="file"
                id="upload"
                onChange={handleFile}
                accept="image/png, image/gif, image/jpeg"
              />
            </div>
            {alert.status !== "" && (
              <div>
                <Alert variant="outlined" severity={alert.status}>
                  {alert.message}
                </Alert>
              </div>
            )}
            <div className={styles.btnSubmit}>
              <Button size="large" variant="contained" onClick={file ? handleEdit : handleEditData}>
                Guardar
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
