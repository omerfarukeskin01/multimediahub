const express = require("express");
const router = express.Router();
const { Users, Posts, Likes, Medias } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll({
    include: [
      { model: Likes },
      { model: Medias },
      {
        model: Users,
        attributes: ["username"], // Sadece username alanını al
      },
    ],
  });

  const likedPosts = await Likes.findAll({ where: { UserId: 2 } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id, {
    include: [
      {
        model: Users,
        attributes: ["username"],
      },
    ],
  });
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [
      { model: Likes },
      { model: Medias },
      {
        model: Users,
        attributes: ["username"], // Sadece username alanını al
      },
    ],
  });
  res.json(listOfPosts);
});
router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  console.log("post: ", post);
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
