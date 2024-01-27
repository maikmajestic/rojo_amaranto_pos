import express from "express"
import mysql from "mysql"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "rojo_amaranto_pos",
})

const diskStorage = multer.diskStorage({
  destination: path.join("../frontend/public/images/products"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const fileUpload = multer({
  storage: diskStorage,
}).single("image")

app.get("/", (req, res) => {
  return res.json("From API")
})

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users"
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products"
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.get("/cart", (req, res) => {
  const sql = "SELECT * FROM temp_cart"
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.get("/sales", (req, res) => {
  const sql = "SELECT * FROM sales"
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.get("/categories", (req, res) => {
  const sql = "SELECT * FROM categories"
  db.query(sql, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.post("/upload", fileUpload, (req, res) => {
  const file = path.join("public/images/products/" + req.file.filename)
  const sql = "INSERT INTO products SET `product_image`=?"
  db.query(sql, [file], (err, data) => {
    if (!err) {
      return res.json(data)
    }
    console.log(err)
  })
})

app.put("/editImage/:id", fileUpload, (req, res) => {
  const file = path.join("public/images/products/" + req.file.filename)
  const id = req.params.id
  const sql = "UPDATE products SET `product_image`=? WHERE `id_product`=?"
  db.query(sql, [file, id], (err, data) => {
    if (!err) {
      return res.json(data)
    }
    console.log(err)
  })
})

app.put("/uploadProduct/:id", (req, res) => {
  const sql =
    "UPDATE products SET `product_name`=?, `product_description`=?, `product_type`=?, `product_status`=?, `product_price`=? WHERE `id_product`=?"
  const id = req.params.id
  db.query(
    sql,
    [req.body.name, req.body.description, req.body.type, req.body.status, req.body.price, id],
    (err, data) => {
      if (!err) {
        return res.json(data)
      } else return err.message
    }
  )
})

app.put("/editProduct/:id", (req, res) => {
  const sql =
    "UPDATE products SET `product_name`=?, `product_description`=?, `product_type`=?, `product_status`=?, `product_price`=? WHERE `id_product`=?"
  const id = req.params.id
  db.query(
    sql,
    [req.body.name, req.body.description, req.body.type, req.body.status, req.body.price, id],
    (err, data) => {
      if (!err) {
        return res.json(data)
      } else return err.message
    }
  )
})

app.put("/orderDelivered/:id", (req, res) => {
  const sql =
    "UPDATE sales SET `delivered`=? WHERE `id_sale`=?"
  const id = req.params.id
  db.query(
    sql,
    [true, id],
    (err, data) => {
      if (!err) {
        return res.json(data)
      } else return err.message
    }
  )
})

app.post("/addCart", (req, res) => {
  const sql =
    "INSERT INTO temp_cart SET `product_name`=?, `product_quantity`=?, `product_price`=?, `product_total`=?"
  db.query(
    sql,
    [req.body.name, req.body.quantity, req.body.price, req.body.total],
    (err, data) => {
      if (!err) {
        return res.json(data)
      } else return err.message
    }
  )
})

app.post("/completeCart", (req, res) => {
  const toDeliver = req.body.toDeliver === true ? false : true;
  const sql =
    "INSERT INTO sales SET `sale_invoice`=?, `client_name`=?, `client_address`=?, `phone_client`=?, `date_delivery`=?, `delivered`=?, `client_notes`=?, `client_items`=?, `sale_subtotal`=?, `sale_shipping`=?, `sale_payment`=?, `sale_total`=?"
  db.query(sql, [
    req.body.invoice,
    req.body.nameClient,
    req.body.addressClient,
    req.body.phoneClient,
    req.body.dateDelivery,
    toDeliver,
    req.body.notesClient,
    req.body.items,
    req.body.subtotal,
    req.body.delivery,
    req.body.paymentClient,
    req.body.total
  ], (err, data) => {
    if (!err) {
      return res.json(data)
    } else return console.log(err)
  })
})

app.post("/removeCart", (req, res) => {
  const sql = "DELETE FROM `temp_cart`"
  db.query(sql, (err, data) => {
    if (!err) {
      return res.json(data)
    } else return err.message
  })
})

app.delete("/deleteProduct/:id", (req, res) => {
  const id = req.params.id
  const sql = "DELETE FROM products WHERE id_product=?"
  db.query(sql, [id], (err, data) => {
    if (!err) {
      return res.json(data)
    } else return err.message
  })
})

app.listen(8081, () => {
  console.log("Listening")
})
