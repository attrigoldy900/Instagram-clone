const {render} = require("ejs");
const express =  require("express");
const app = express();
const port = 1212;
const path = require("path");
const {v4: uuidv4} = require("uuid");
const methodOverride = require("method-override");
const multer = require("multer");
const { use } = require("react");

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({storage});

let posts = [
    {
        id: uuidv4(),
        username: "goldyattri",
        image: "/images/goldy.jpg",
        caption: "I love myself!",
    },
    {
        id: uuidv4(),
        username: "tanuattri",
        image: "/images/tanu.jpg",
        caption: "chuppp ho jaa!!",
    },
    {
        id: uuidv4(),
        username: "paramjeetsingh",
        image: "/images/param.jpg",
        caption: "accha ji esa h kya!!",
    },
];

app.get("/posts", (req, res) => {
    res.render("index.ejs", {posts});
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", (req, res) => {
    let {id, username, image, caption} = req.body; 
    const newPost = {
        id: uuidv4(),
        username,
        image,
        caption
    };
    posts.push(newPost);
    res.json(newPost);
});

app.get("/posts/:id", (req, res) => {
    let [id] = req.params;
    let post = posts.find((p) => id === p.id);
    console.log(post);
    res.render("show.ejs", {post});
});

app.patch("/posts/:id", upload.single("photo"), (req, res) => {
    let {id} = req.params;
    let newCaption = req.body.caption;
    let post = posts.find((p) => id === p.id);
    post.caption = newCaption;
    if(req.file) post.photo = req.file.filename;
    console.log(post);
    res.redirect(`/posts/${post.id}`);
});

app.get("/posts/:id/edit", (req, res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", {post});
});

app.delete("/posts/:id", (req, res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log("listening to port : 1212");
});