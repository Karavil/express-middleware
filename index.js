const express = require("express");

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
   res.send(`<h2>Let's write some middleware!</h2>`);
});

app.listen(process.env.PORT || 5000);
