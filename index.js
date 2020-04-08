const express = require("express");

const userRouter = require("./users/userRouter");
const postRouter = require("./users/userRouter");

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
   res.send(`<h2>Let's write some middleware!</h2>`);
});

app.listen(5000);
