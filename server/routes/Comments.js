const express = require("express");
const router = express.Router();
const { PostComments } = require("../models/");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await PostComments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
  comment.UserId=req.user.id;
  comment.username = username;
  await PostComments.create(comment);
  res.json(comment);
});
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  await PostComments.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});


module.exports = router;