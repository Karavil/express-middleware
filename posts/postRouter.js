const express = require("express");
const postDB = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
   postDB
      .get()
      .then((posts) => {
         res.status(200).json(posts);
      })
      .catch((err) => {
         res.status(500).json("Weird error...");
      });
});

router.get("/:id", validatePostID, (req, res) => {
   postDB
      .getById(req.params.id)
      .then((post) => {
         res.status(200).json(post);
      })
      .catch((err) => {
         res.status(500).json("Weird error...");
      });
});

router.delete("/:id", validatePostId, (req, res) => {
   postDB
      .remove(req.params.id)
      .then((count) => {
         res.status(200).json({ message: "Post deleted" });
      })
      .catch((err) => {
         res.status(500).json("Weird error...");
      });
});

router.put("/:id", validatePostId, validatePostEdit, (req, res) => {
   postDB
      .update(req.params.id, req.body)
      .then((count) => {
         if (count) res.status(200).json("Changes applied");
         else res.status(500).json("Changes could not be applied.");
      })
      .catch((err) => {
         res.status(500).json({ message: "Weird error..." });
      });
});

// custom middleware

function validatePostId(req, res, next) {
   postDB
      .getById(req.params.id)
      .then((post) => {
         if (post) {
            next();
         } else {
            res.status(404).json({ message: "Post id is not valid/found." });
         }
      })
      .catch((err) => {
         res.status(500).json(
            "Weird error... make sure to have an ID in your request parameters."
         );
      });
}

function validatePostEdit(req, res, next) {
   if (
      req.body.text &&
      req.body.text.length > 0 &&
      req.body.user_id &&
      Number.isInteger(req.body.user_id)
   ) {
      next();
   } else {
      res.status(400).json({
         message: "Please make sure to input a text and user_id for the post.",
      });
   }
}

module.exports = router;
