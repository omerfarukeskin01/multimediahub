const express = require("express");
const router = express.Router();
const {
  Medias,
  FilmDetails,
  GameDetails,
  SeriesDetails,
  Posts,
  Likes,
} = require("../models");
const { Op } = require("sequelize");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:page", async (req, res) => {
  const page = req.params.page;
  const limit = 15;
  const offset = page * limit - limit;
  const listOfMedias = await Medias.findAll({
    limit: limit,
    offset: offset,
  }); //, include: [Likes]
  const count = await Medias.count();
  const numberOfPages = Math.ceil(count / limit);
  res.json({ listOfMedias: listOfMedias, numberOfPages: numberOfPages });
});

router.get("/mediadetail/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const media = await Medias.findByPk(id, {
      include: [
        { model: FilmDetails, required: false },
        { model: GameDetails, required: false },
        { model: SeriesDetails, required: false },
      ],
    });

    if (!media) {
      return res.status(404).send("Media not found");
    }

    let detail;
    switch (media.MediaType) {
      case "Film":
        detail = media.FilmDetail;
        break;
      case "Game":
        detail = media.GameDetail;
        break;
      case "Series":
        detail = media.SeriesDetail;
        break;
      default:
        return res.status(400).send("Invalid media type");
    }

    return res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
router.get("/mediasearch", async (req, res) => {
  const { mediaQuery } = req.query;

  try {
    const searchTerms = mediaQuery.split(/\s+/); // Boşluklara göre bölünmüş terimler
    const searchConditions = searchTerms.map((term) => {
      return {
        MediaNametext: {
          [Op.like]: `%${term}%`, // Her terimin herhangi bir yerde geçtiği kayıtları bulur
        },
      };
    });

    const medias = await Medias.findAll({
      where: {
        [Op.or]: searchConditions, // Tüm koşulları OR operatörüyle birleştirir
      },
      limit: 5,
    });

    if (medias.length === 0) {
      return res.status(404).json({ error: "Media Not Found" });
    }

    res.json(medias);
  } catch (error) {
    console.error("Error during media search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/* router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
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
}); */

module.exports = router;
