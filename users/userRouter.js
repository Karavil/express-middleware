const express = require("express");
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
   userDB
      .insert(req.body)
      .then((newUser) => {
         res.status(201).json(newUser);
      })
      .catch((err) => {
         res.status(500).json("Weird error...");
      });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
   postDB
      .insert({ ...req.body, user_id: req.params.id })
      .then((id) => {
         res.status(201).json(id);
      })
      .catch((err) => {
         res.status(500).json("Weird error...");
      });
});

router.get("/", (req, res) => {
   userDB
      .get()
      .then((users) => {
         res.status(200).json(users);
      })
      .catch((err) => {
         res.status(500).json("Weird error...");
      });
});

router.get("/:id", validateUserId, (req, res) => {
   userDB
      .getById(req.params.id)
      .then((user) => {
         res.status(200).json(user);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json("Weird error...");
      });
});

router.get("/:id/posts", validateUserId, (req, res) => {
   userDB
      .getUserPosts(req.params.id)
      .then((posts) => {
         res.status(200).json(posts);
      })
      .catch((err) => {
         res.status(500).json("Weird error...");
      });
});

router.delete("/:id", validateUserId, (req, res) => {
   userDB
      .remove(req.params.id)
      .then((count) => {
         res.status(200).json({ message: "User deleted" });
      })
      .catch((err) => {
         res.status(500).json("Weird error...");
      });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
   userDB
      .update(req.params.id, req.body)
      .then((count) => {
         if (count) {
            res.status(200).json({ message: "User updated" });
         }
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({ message: "Weird error..." });
      });
});

//custom middleware

function validateUserId(req, res, next) {
   userDB
      .getById(req.params.id)
      .then((user) => {
         if (user) {
            next();
         } else {
            res.status(404).json({ message: "User id is not valid." });
         }
      })
      .catch((err) => {
         res.status(500).json(
            "Weird error... make sure to have an ID in your request parameters."
         );
      });
}

function validateUser(req, res, next) {
   if (req.body.name && req.body.name.length > 0) {
      next();
   } else {
      res.status(400).json({
         message: "Please make sure to input a name for the user.",
      });
   }
}

function validatePost(req, res, next) {
   if (req.body.name && req.body.name.length > 0) {
      next();
   } else {
      res.status(400).json({
         message: "Please make sure to input a text for the post.",
      });
   }
}

module.exports = router;
