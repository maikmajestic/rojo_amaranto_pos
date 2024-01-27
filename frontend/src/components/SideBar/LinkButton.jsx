import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import Typography from "@mui/material/Typography"
import styles from './LinkButton.module.scss'

export default function LinkButton() {
  return (
    <div className={styles.containerLink}>
      <LocalFloristIcon/>
      <Typography>
        Rosas
      </Typography>
    </div>
  )
}