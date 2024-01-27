import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Badge from "@mui/material/Badge"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"

import PathConstants from "../../routes/pathConstants"
import logo from "../../../public/logoRA.svg"
import NotificationSound from "../../../public/notification-sound.mp3"
import styles from "./Topbar.module.scss"

const pages = [
  {
    value: "/",
    label: "Inventario",
  },
  {
    value: "SALES",
    label: "Ventas",
  },
]

export default function TopBar() {
  const audioPlayer = useRef(null)
  const [, setData] = useState()
  const [alerts, setAlerts] = useState(false)

  useEffect(() => {
    const intervalID = setInterval(() => {
      fetch("http://localhost:8081/sales")
        .then((res) => res.json())
        .then((data) => {
          if (data.some((e) => e.delivered === 0)) {
            setAlerts(true)
            //audioPlayer.current.play();
          } else {
            setAlerts(false)
          }
          setData(data)
        })
        .catch((err) => console.error(err))
    }, 1000)

    return () => clearInterval(intervalID)
  }, [])

  return (
    <AppBar position="static" className={styles.appBar}>
      <Container maxWidth="xl" className={styles.containerTopBar}>
        <Toolbar disableGutters className="toolBar">
          <Link className={styles.link} key="sales10" to={PathConstants["/"]}>
            <img src={logo} />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" }, ml: 4 }}>
            {pages.map((page) => (
              <Link
                className={styles.link}
                key={page.value}
                to={PathConstants[page.value]}>
                {page.label}
              </Link>
            ))}
          </Box>
          <audio ref={audioPlayer} src={NotificationSound} />
          {alerts && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Envíos pendientes">
                <Link
                  className={styles.link}
                  key="sales10"
                  to={PathConstants["SALES"]}>
                  <IconButton sx={{ p: 0 }}>
                    <Badge color="error" badgeContent={1}>
                      <LocalShippingIcon color="action" />
                    </Badge>
                  </IconButton>
                </Link>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
