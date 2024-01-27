import { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TablePagination from "@mui/material/TablePagination"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import Paper from "@mui/material/Paper"
import axios from "axios"

import { currencyFormat } from "../utils/currencyFormat"
import { formatDate, formatDateLocalSimple } from "../utils/formatDate"
import styles from "./SalesTable.module.scss"

export default function SalesTable() {
  const [data, setData] = useState([])
  const [totalSales, setTotalSales] = useState()
  const [minDateSearch, setMinDateSearch] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDelivered = (event, id) => {
    const delivered = event.target.checked
    axios
      .put("http://localhost:8081/orderDelivered/" + id, delivered)
      .then((res) => {
        console.log(res)
        window.location.reload()
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetch("http://localhost:8081/sales")
      .then((res) => res.json())
      .then((data) => {
        const arrSales = [];
        data.sort((a, b) => (a.sale_date < b.sale_date ? 1 : -1))
        const subtotal = data.reduce(
          (accumulator, currentValue) => accumulator + currentValue.sale_total,
          0
        )
        data.map((sale) => {
          const newDate = formatDate(sale.sale_date)
          const saleObject = {
            id: sale.id_sale,
            sale_date: formatDateLocalSimple(sale.sale_date),
            sale_formatted_date: newDate,
            sale_invoice: sale.sale_invoice,
            client_name: sale.client_name ? sale.client_name : "-",
            client_address: sale.client_address ? sale.client_address : "-",
            client_phone: sale.phone_client ? sale.phone_client : "-",
            date_delivery: sale.date_delivery
              ? formatDate(sale.date_delivery)
              : "-",
            delivered: sale.delivered,
            client_notes: sale.client_notes ? sale.client_notes : "-",
            client_items: sale.client_items,
            sale_subtotal: currencyFormat(sale.sale_subtotal),
            sale_shipping: currencyFormat(sale.sale_shipping),
            sale_payment: sale.sale_payment,
            sale_total: currencyFormat(sale.sale_total),
          }
          arrSales.push(saleObject)
        })
        const filtered = arrSales.filter((sale) =>
          sale.sale_date.includes(minDateSearch)
        )
        setData(filtered)
        setTotalSales(subtotal)
      })
      .catch((err) => console.error(err))
  }, [minDateSearch])

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
        }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={12} lg={12}>
            <div className={styles.salesAmount}>
              Ventas{" "}
              {minDateSearch
                ? " del día: " + currencyFormat(totalSales)
                : " totales: " + currencyFormat(totalSales)}
            </div>
            <div className={styles.formDate}>
              <label className={styles.formDateLabel} htmlFor="input-date">
                Filtrar por Fecha:
              </label>
              <input
                id="input-date"
                className={styles.formDateInput}
                type="date"
                min="2024-01-24"
                max="2024-12-31"
                onChange={(e) => setMinDateSearch(e.target.value)}
              />
            </div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Folio</TableCell>
                    <TableCell align="left">Cliente</TableCell>
                    <TableCell align="left">Dirección</TableCell>
                    <TableCell align="left">Fecha de compra</TableCell>
                    <TableCell align="left">Fecha de entrega</TableCell>
                    <TableCell align="left">Productos</TableCell>
                    <TableCell align="center">Tipo de Pago</TableCell>
                    <TableCell align="center">Entregado</TableCell>
                    <TableCell align="left">Envío</TableCell>
                    <TableCell align="left">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? data.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : data
                  ).map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}>
                      <TableCell component="th" scope="row">
                        {row.sale_invoice}
                      </TableCell>
                      <TableCell component="th">{row.client_name}</TableCell>
                      <TableCell align="left">{row.client_address}</TableCell>
                      <TableCell align="left">{row.sale_formatted_date}</TableCell>
                      <TableCell align="left">{row.date_delivery}</TableCell>
                      <TableCell align="left">{row.client_items}</TableCell>
                      <TableCell align="center">{row.sale_payment}</TableCell>
                      <TableCell align="center">
                        {row.delivered !== 0 && (
                          <LocalShippingIcon color="success" />
                        )}
                        {row.delivered === 0 && (
                          <FormControlLabel
                            sx={{ m: 0 }}
                            control={
                              <Checkbox
                                sx={{
                                  color: "#f00",
                                  "&.Mui-checked": {
                                    color: "green",
                                  },
                                }}
                                icon={<LocalShippingOutlinedIcon />}
                                checkedIcon={<LocalShippingIcon />}
                                id="delivered"
                                onChange={(e) => handleDelivered(e, row.id)}
                              />
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell align="left">{row.sale_shipping}</TableCell>
                      <TableCell align="left">{row.sale_total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
