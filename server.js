const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require('express-session');
 
const db = require('./db');
const app = express();
app.use(express.json());
app.use(cors());//for sessions
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key:"userId",
    secret:"Harsh",
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:60*60*24,
        },
    })
);


// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

app.post("/create-products", (req, res) => {
  console.log(req.body);

  const { name, price, description ,vendor_id,category_id} = req.body;
   console.log(price);

    const insert = "INSERT INTO  rosx_products(rosx_product_name,rosx_product_price,rosx_product_description,rosx_product_vendor_id,Rosx_product_category_id ) VALUES (?,?,?,?,?)";
    db.query(insert, [name,price,description,vendor_id,category_id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error inserting user into database' });
        return;
      }

      console.log('User inserted successfully');
      res.status(200).json({ message: 'User registered successfully' });
    });
  });

  app.post("/alter-products", (req, res) => {
    console.log(req.body);
  
    const { id, name, price, description, vendor_id, category_id } = req.body;
    console.log(price);
  
    const update = "UPDATE rosx_products SET rosx_product_name = ?, rosx_product_price = ?, rosx_product_description = ?, rosx_product_vendor_id = ?, Rosx_product_category_id = ? WHERE rosx_product_id = ?";
    db.query(update, [name, price, description, vendor_id, category_id, id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating product in database' });
        return;
      }
  
      console.log('Product updated successfully');
      res.status(200).json({ message: 'Product updated successfully' });
    });
  });
  
  
app.post("/api/register", (req, res) => {
    console.log(req.body);
  
    const { name, password, Logintype } = req.body;
    const salt = bcrypt.genSaltSync(10);
  
    // Hash the password
    const hash = bcrypt.hashSync(password, salt);
     
  
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error inserting user into database' });
        return;
      }
    });
      if(Logintype=="VENDOR"){
      const insert1 = "INSERT INTO  rosx_vendor(rosx_vendor_name,rosx_vendor_address  ) VALUES (?,?)";
      db.query(insert1, [name, Logintype], (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error inserting user into database' });
          return;
        }
      });}

      const insert = "INSERT INTO  rosx_users(rosx_username,rosx_password,rosx_user_type ) VALUES (?,?,?)";
      db.query(insert, [name, hash, Logintype], (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error inserting user into database' });
          return;
        }
  
        console.log('User inserted successfully');
        res.status(200).json({ message: 'User registered successfully' });
      });
    });
    
  

  app.post("/api/users", (req, res) => {
    const { username, password  } = req.body;
     

    const select = "SELECT * FROM rosx_users WHERE rosx_username = ?";
    db.query(select, [username], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error retrieving user from database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
       
    
        
      const user = results[0];
  
      const { rosx_username, rosx_user_type, rosx_password } = user;
    const passwordMatch = bcrypt.compareSync(password, rosx_password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
      res.status(200).json({ username: rosx_username, userType: rosx_user_type });
    });
  });

  app.get("/products",(req,res)=>{
    const id=req.params.id;
    
    const sqlGet = "SELECT * FROM  rosx_products  ";
    db.query(sqlGet,[id],(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.send(result);
    });
});
app.get("/users",(req,res)=>{
  
  
  const sqlGet = "SELECT * FROM   rosx_users  ";
  db.query(sqlGet,(err,result)=>{
      if(err) console.log(err);
      console.log(result);
      res.send(result);
  });
});
app.delete("/delete/:id",(req,res)=>{
  const id = req.params.id;
  console.log(id);
  const remove = "DELETE FROM  rosx_products WHERE rosx_product_id = ?";
  db.query(remove,id,(err,result)=>
  {
      if(err) console.log(err); 
      res.send('done');
  })
});
app.delete("/delete-user/:id",(req,res)=>{
  const id = req.params.id;
  console.log(id);
  const remove = "DELETE FROM  rosx_users WHERE rosc_user_id = ?";
  db.query(remove,id,(err,result)=>
  {
      if(err) console.log(err); 
      res.send('done');
  })
});

app.listen(8080, () => console.log(`Server listening on port ${8080}!`));
