const express = require("express");
const router = express.Router();
const { PostComments, MediaComments, Rating, Users } = require("../models/");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Post comment routes
router.get("/post/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await PostComments.findAll({
      where: { PostId: postId },
      include: [
        {
          model: Users,
          attributes: ["username"],
        },
      ],
      raw: true,
    });

    // Her yorum için istenmeyen 'User.username' alanını kaldır
    const formattedComments = comments.map((comment) => {
      const { "User.username": username, ...restComment } = comment;
      return {
        ...restComment,
        username, // 'username' alanını direkt olarak ekleyin
      };
    });

    res.json(formattedComments);
  } catch (error) {
    res.status(500).send("Sunucu hatası: " + error.message);
  }
});

router.post("/post", validateToken, async (req, res) => {
  const comment = req.body;
  comment.UserId = req.user.id;

  await PostComments.create(comment);
  res.json(comment);
});

router.delete("/post/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  await PostComments.destroy({ where: { id: commentId } });
  res.json("DELETED SUCCESSFULLY");
});

// Media comment routes
router.get("/media/:mediaId", async (req, res) => {
  const mediaId = req.params.mediaId;

  try {
    const comments = await MediaComments.findAll({
      where: { MediaId: mediaId },
      include: [
        {
          model: Users,
          attributes: ["username"],
        },
      ],
      raw: true,
    });

    // Her yorum için istenmeyen 'User.username' alanını kaldır
    const formattedComments = comments.map((comment) => {
      const { "User.username": username, ...restComment } = comment;
      return {
        ...restComment,
        username, // 'username' alanını direkt olarak ekleyin
      };
    });

    res.json(formattedComments);
  } catch (error) {
    res.status(500).send("Sunucu hatası: " + error.message);
  }
});

router.post("/media", validateToken, async (req, res) => {
  const commentData = req.body;
  commentData.UserId = req.user.id;

  try {
    const newComment = await MediaComments.create(commentData);
    return res.json(newComment); // Oluşturulan yorumu yanıt olarak döndürün
  } catch (error) {
    console.error("Yorum oluşturma hatası:", error);
    return res.status(500).send("Yorum oluşturulamadı");
  }
});

router.delete("/media/:mediacommentId", validateToken, async (req, res) => {
  const commentId = req.params.mediacommentId;
  await MediaComments.destroy({ where: { id: commentId } });
  res.json("DELETED SUCCESSFULLY");
});

//rating
router.post("/rating", validateToken, async (req, res) => {
  const { MediaId, value } = req.body;
  const UserId = req.user.id;

  try {
    // Önce mevcut rating'i ara
    let rating = await Rating.findOne({
      where: { MediaId, UserId },
    });

    if (rating) {
      // Eğer rating varsa, güncelle
      if (rating.value === value) {
        await Rating.destroy({ where: { id: value } });
      } else {
        rating = await rating.update({ value });
      }
    } else {
      // Eğer rating yoksa, yeni bir rating oluştur
      rating = await Rating.create({ MediaId, UserId, value });
    }

    return res.json(rating);
  } catch (error) {
    console.error("Değerlendirme işlemi hatası:", error);
    return res.status(500).send("Değerlendirme işlemi başarısız");
  }
});

router.get("/rating/user/:mediaId", validateToken, async (req, res) => {
  const mediaId = req.params.mediaId;
  const userId = req.user.id;
  const rating = await Rating.findOne({
    where: { MediaId: mediaId, UserId: userId },
  });

  res.json(rating);
});

router.get("/rating/meanmedia/:mediaId", async (req, res) => {
  const mediaId = req.params.mediaId;
  const rating = await Rating.findAll({
    where: { MediaId: mediaId },
  });
  if (rating.length === 0) {
    rating.length = 1;
  }
  const mean =
    rating.reduce((acc, curr) => acc + curr.value, 0) / rating.length;
  res.json(mean);
});
module.exports = router;
