import { useEffect, useState } from "react"
import axios from "axios"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import FormControl from "@mui/material/FormControl"
import Autocomplete from "@mui/material/Autocomplete"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import InputLabel from '@mui/material/InputLabel'

import { productTypes } from "../utils/categories"
import styles from "./UploadProduct.module.scss"

export default function UploadProduct() {
  const [file, setFile] = useState(null)
  const [disabled, setDisabled] = useState(true)
  const [productType, setProductType] = useState("")
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  })
  const [dataProduct, setDataProduct] = useState({
    name: "",
    description: "",
    type: "",
    price: 0,
    id: null,
    status: "Activo",
  })

  const handleFile = (e) => {
    setFile(e.target.files[0])
  }

  const handleDataProduct = (e) => {
    let value = e.target.value
    let prop = e.target.id
    setDataProduct({
      ...dataProduct,
      [prop]: value,
    })
  }

  const handleStatus = (e) => {
    const status = e.target.value;
    setDataProduct({ ...dataProduct, status})
  }

  const handleUpload = () => {
    const formData = new FormData()
    formData.append("image", file)
    axios
      .post("http://localhost:8081/upload", formData)
      .then((res) => {
        const id = res.data.insertId
        axios
          .put("http://localhost:8081/uploadProduct/" + id, dataProduct)
          .then((res) => {
            if (res.status === 200) {
              setAlert({
                ...alert,
                status: "success",
                message: "Producto agregado correctamente",
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
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    if (
      dataProduct.name === "" ||
      dataProduct.description === "" ||
      dataProduct.price <= 0 ||
      dataProduct.type === null
    ) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [dataProduct])

  return (
    <Container maxWidth="xl" sx={{ mb: 2 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={12} lg={12} className={styles.containerForm}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { mt: 2, width: "100%" },
            }}
            noValidate
            autoComplete="off">
            <div>
              <h4 style={{ marginBottom: '2rem'}}>Agregar Producto a Inventario</h4>
            </div>
            <div>
              <TextField
                id="name"
                label="Nombre"
                placeholder="Nombre del producto"
                multiline
                variant="filled"
                onChange={handleDataProduct}
              />
            </div>
            <div>
              <TextField
                id="description"
                label="Descripción"
                placeholder="Descripción del producto"
                multiline
                variant="filled"
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
                    setProductType(newValue)
                    setDataProduct({ ...dataProduct, type: newValue })
                  }}
                  options={productTypes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo de producto"
                      variant="filled"
                    />
                  )}
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
                id="price"
                label="Precio"
                placeholder="Precio del producto"
                variant="filled"
                type="number"
                onChange={handleDataProduct}
              />
            </div>
            <div className={styles.imgProduct}>
              <img src={file && URL.createObjectURL(file)} />
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
              <Button
                disabled={disabled}
                size="large"
                variant="contained"
                onClick={handleUpload}>
                Guardar
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
