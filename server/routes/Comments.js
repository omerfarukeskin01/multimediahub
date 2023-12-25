const express = require("express");
const router = express.Router();
const { PostComments ,MediaComments} = require("../models/");
const { validateToken } = require("../middlewares/AuthMiddleware");
//post comment
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await PostComments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  const username = req.user.username;
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
//Media comment
router.get("/:mediaId", async (req, res) => {
  const mediaId = req.params.mediaId;
  const comments = await MediaComments.findAll({ where: { MediaId: mediaId } });
  res.json(comments);
});
module.exports = router;