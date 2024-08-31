import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db=new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "chandu",
  password: "Chandu@343",
  port: 5433,
})
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async(req, res) => {
  const resut=await db.query("select * from items");
  //console.log(resut.rows);
  items=resut.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  if(item ==""){
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
      adderror: "Fieldshouldnotbeleftempty"
    });
  }
  else{
    await db.query("insert into items (title) values($1)",[item]);
   // items.push({ title: item });
  res.redirect("/");
}
  
});

app.post("/edit", async(req, res) => {
  try{
    await db.query("update items set title=$1 where id=$2",[req.body.updatedItemTitle,req.body.updatedItemId]);  
  }
  catch(err){
   res.sendStatus(400);
  }
  res.redirect("/");
  //await db.query("update items set title=$1 where id=$2",[req.body.updatedItemTitle,req.body.updatedItemId]);
});

app.post("/delete", async(req, res) => {
  console.log(req.body);
  await db.query("delete from items where id=$1",[req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
