import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import ScheduleIcon from "@mui/icons-material/Schedule"
import Divider from "@mui/material/Divider"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import { styled } from "@mui/material/styles"
import InputBase from "@mui/material/InputBase"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import axios from "axios"

import { currencyFormat } from "../utils/currencyFormat"
import { formatDateLocal } from "../utils/formatDate"
import styles from "./PointOfSale.module.scss"

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    color: "#fff",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))

export default function PointOfSale() {
  const [date] = useState(new Date())
  const [data, setData] = useState([])
  const [checkedTax, setCheckedTax] = useState(false)
  const [, setTotalTax] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [disabled, setDisabled] = useState(true)
  const [dataSale, setDataSale] = useState({
    invoice: "",
    nameClient: "",
    addressClient: "",
    notesClient: "",
    items: "",
    paymentClient: "Efectivo",
    subtotal: 0,
    delivery: 0,
    total: 0,
    phoneClient: "",
    dateDelivery: "",
    toDeliver: false,
  })

  const handleDelivery = (e) => {
    const formatNum = parseInt(e.target.value)
    const newTotal = dataSale.subtotal + formatNum
    setDataSale({ ...dataSale, delivery: formatNum, total: newTotal })
    setTotalAmount(newTotal)
  }

  const handlePayment = (e) => {
    const value = e.target.value
    setDataSale({ ...dataSale, paymentClient: value })
  }

  const handleTax = (event) => {
    const checked = event.target.checked
    setCheckedTax(checked)
    if (checked) {
      setTotalTax(Math.ceil(totalAmount * 1.16))
    } else {
      setTotalTax(totalAmount)
    }
  }

  const handleSale = (e) => {
    let value = e.target.value
    let id = e.target.id
    if (id === "dateDelivery") {
      value = formatDateLocal(value)
    }
    setDataSale({
      ...dataSale,
      [id]: value,
    })
  }

  const removeCart = () => {
    axios
      .post("http://localhost:8081/removeCart")
      .then((res) => {
        console.log(res)
        window.location.reload()
      })
      .catch((err) => console.log(err))
  }

  const completeCart = () => {
    axios
      .post("http://localhost:8081/completeCart", dataSale)
      .then((res) => {
        console.log(res)
        removeCart()
        window.location.reload()
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetch("http://localhost:8081/cart")
      .then((res) => res.json())
      .then((data) => {
        const invoice =
          data.length < 1
            ? ""
            : "RA" + Math.floor(Math.random() * (100000 - 0 + 1) + 0)
        setData(data)
        const items =
          dataSale.items +
          data.map(
            (product) => product.product_quantity + " " + product.product_name
          )
        const subtotal = data.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.product_total,
          0
        )
        setDataSale({
          ...dataSale,
          invoice,
          items,
          subtotal,
          total: subtotal + dataSale.delivery,
        })
        setTotalAmount(subtotal + dataSale.delivery)
      })
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    if (checkedTax) {
      setDataSale({ ...dataSale, total: Math.ceil(totalAmount * 1.16) })
    } else {
      setDataSale({ ...dataSale, total: totalAmount })
    }
  }, [checkedTax, dataSale.delivery])

  useEffect(() => {
    if (dataSale.toDeliver) {
      if (
        dataSale.nameClient === "" ||
        dataSale.addressClient === "" ||
        dataSale.phoneClient === "" ||
        dataSale.dateDelivery === "" ||
        dataSale.delivery === 0
      ) {
        setDisabled(true)
      } else {
        setDisabled(false)
      }
    } else {
      if (dataSale.nameClient === "" || data.length < 1) {
        setDisabled(true)
      } else {
        setDisabled(false)
      }
    }
  }, [dataSale])

  return (
    <Box
      sx={{
        width: "100%",
      }}
      noValidate
      autoComplete="off">
      <div className={styles.posContainer}>
        <div className={styles.posOrderContent}>
          <div className={styles.posHeader}>
            <ScheduleIcon />
            {date.toLocaleDateString()} - Punto de Venta
          </div>
          <Divider variant="middle" light />
          <div className={styles.posOrderTitle}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="body2" className={styles.posOrderHeading}>
                  Número de Orden: <span>{dataSale.invoice}</span>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
              <Grid item xs={11} md={11}>
                <Typography variant="body2" className={styles.posOrderHeading}>
                  Nombre de Cliente
                </Typography>
                <TextField
                  id="nameClient"
                  onChange={handleSale}
                  value={dataSale.name}
                  fullWidth
                  variant="standard"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={1} md={1}>
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Checkbox
                      sx={{
                        color: "#fff",
                        "&.Mui-checked": {
                          color: "green",
                        },
                      }}
                      icon={<LocalShippingIcon />}
                      checkedIcon={<LocalShippingIcon />}
                      onChange={(e) =>
                        setDataSale({
                          ...dataSale,
                          toDeliver: e.target.checked,
                        })
                      }
                      id="delivered"
                    />
                  }
                />
              </Grid>
            </Grid>
            {dataSale.toDeliver && (
              <>
                <Grid container spacing={0} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={12} lg={12}>
                    <Typography
                      variant="body2"
                      className={styles.posOrderHeading}>
                      Dirección
                    </Typography>
                    <TextField
                      id="addressClient"
                      value={dataSale.address}
                      onChange={handleSale}
                      fullWidth
                      variant="standard"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="body2"
                      className={styles.posOrderHeading}>
                      Teléfono cliente
                    </Typography>
                    <TextField
                      autoComplete="off"
                      id="phoneClient"
                      onChange={handleSale}
                      fullWidth
                      variant="standard"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      variant="body2"
                      className={styles.posOrderHeading}>
                      Fecha de Entrega
                    </Typography>
                    <input
                      id="dateDelivery"
                      className={styles.formDateInput}
                      type="datetime-local"
                      min="2024-01-24"
                      onChange={handleSale}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    className={styles.posOrderHeading}>
                    Notas
                  </Typography>
                  <TextField
                    className={styles.posOrderHeading}
                    id="notesClient"
                    value={dataSale.notes}
                    onChange={handleSale}
                    multiline
                    fullWidth
                    rows={4}
                    variant="filled"
                  />
                </Grid>
              </>
            )}
          </div>
          <Divider variant="middle" light sx={{ mb: 5 }} />
          {data.length < 1 && (
            <div className={styles.placeholderSale}>
              Agrega productos a la venta
            </div>
          )}
          {data &&
            data.map((product) => (
              <div key={product.id_cart} className={styles.posBody}>
                <Typography variant="h6" className={styles.orderTitle}>
                  {product.product_name}
                  <span>{currencyFormat(product.product_price)}</span>
                </Typography>
                <Typography variant="h6" className={styles.orderQnt}>
                  {product.product_quantity}
                </Typography>
                <Typography variant="h6" className={styles.orderPrice}>
                  {currencyFormat(product.product_total)}
                </Typography>
              </div>
            ))}
        </div>
        <Divider variant="middle" light />
        <div className={styles.posFooter}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography className={styles.paymentLabel} variant="h7">
                Forma de pago
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={dataSale.paymentClient}
                  className={styles.paymentSelect}
                  id="paymentClient"
                  onChange={handlePayment}
                  input={<BootstrapInput />}>
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="Tarjeta Débito">Tarjeta Débito</MenuItem>
                  <MenuItem value="Tarjeta Crédito">Tarjeta Crédito</MenuItem>
                  <MenuItem value="Transferencia">Transferencia</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={9} md={9} className={styles.posPaymentWrapper}>
              <div className={styles.posPaymentTitle}>Subtotal</div>
            </Grid>
            <Grid item xs={3} md={3}>
              <div className={styles.posPaymentSubtitle}>
                {currencyFormat(dataSale.subtotal)}
              </div>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="flex-end" spacing={0}>
            <Grid item xs={9} md={9} className={styles.posPaymentWrapper}>
              <div className={styles.posPaymentTitle}>Envío</div>
            </Grid>
            <Grid item xs={3} md={3}>
              <div className={styles.posPaymentSubtitle}>
                <TextField
                  id="delivery"
                  value={dataSale.delivery}
                  onChange={handleDelivery}
                  className={styles.posDelivery}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    inputProps: { min: 0}
                  }}
                  variant="standard"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container direction="row" justifyContent="flex-end" spacing={0}>
            <Grid item xs={9} md={9} className={styles.posPaymentWrapper}>
              <div className={styles.posPaymentTitle}>IVA</div>
            </Grid>
            <Grid item xs={3} md={3}>
              <div className={styles.posPaymentSubtitle}>
                <FormControlLabel
                  autoComplete="off"
                  control={
                    <Checkbox
                      id="taxes"
                      className={styles.textLabel}
                      checked={checkedTax}
                      onChange={handleTax}
                    />
                  }
                />
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item xs={6} md={6} lg={6} sx={{ mt: 5 }}>
              <Typography variant="h5">Total</Typography>
            </Grid>
            <Grid item xs={6} md={6} lg={6} sx={{ mt: 5 }}>
              <Typography variant="h5" className={styles.totalPrice}>
                {currencyFormat(dataSale.total)}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12} lg={12} sx={{ mt: 5 }}>
              <Button
                size="large"
                variant="contained"
                onClick={completeCart}
                disabled={disabled}>
                Cobrar
              </Button>
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ mt: 2 }}>
              <Button
                size="large"
                variant="contained"
                color="error"
                onClick={removeCart}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </Box>
  )
}
