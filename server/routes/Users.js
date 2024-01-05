const express = require("express");
const router = express.Router();
const { Users, Followers, Posts, Likes, Medias } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");

router.post("/", async (req, res) => {
  const { username, password, Email } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (user == null) {
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
        Email: Email,
      });
      res.json("SUCCESS");
    });
  } else {
    res.json("there exist user who have this username");
  }
});
router.get("/users", validateToken, async (req, res) => {
  const listOfUsers = await Users.findAll();

  res.json(listOfUsers);
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Username And Password Combination" });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    res.json({ token: accessToken, username: username, id: user.id });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
});
router.get("/follower/:uid", async (req, res) => {
  //idsi gönderilen kullanıcıyı takip edenler
  const id = req.params.uid;
  const listofFollowers = await Users.findByPk(id, {
    include: [
      {
        model: Users,
        as: "followed",
      },
    ],
  }).catch((err) => {
    console.log(err);
  });

  if (listofFollowers && listofFollowers.followed) {
    res.json(listofFollowers.followed);
  } else {
    // Eğer takipçi bilgisi bulunamazsa, boş bir dizi veya uygun bir mesaj gönder
    res.json([]);
  }
});
router.get("/followed/:uid", async (req, res) => {
  const id = req.params.uid;

  try {
    const listofFollowers = await Users.findByPk(id, {
      include: [
        {
          model: Users,
          as: "follower",
        },
      ],
    });

    // listofFollowers'in boş olup olmadığını kontrol et
    if (listofFollowers && listofFollowers.follower) {
      res.json(listofFollowers.follower);
    } else {
      // Eğer takipçi bilgisi bulunamazsa, boş bir dizi veya uygun bir mesaj gönder
      res.json([]);
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    res.status(500).send("Sunucu hatası");
  }
});

router.delete("/unfollow/", validateToken, async (req, res) => {
  console.log(
    "LOGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG::::",
    req.user.id
  );
  await Users.findByPk(req.body.followedid)
    .then((followed) => {
      if (!followed) {
        console.log("followed not found!+" + req.body.followedid); //oturum açmış kullanıcının idsi
        req.json("ERROR");
      }
      Users.findByPk(req.user.id).then((follower) => {
        //user id tokenden alınabilir
        if (!follower) {
          console.log("follower not found!+" + req.user.id);
          req.json("ERROR");
        }
        console.log(`>> FOLLOWED ID=${followed.id} FOLLOWER ID=${follower.id}`);
        follower.removeFollower(followed);

        res.json("SUCCESS");
      });
    })
    .catch((err) => {
      console.log(
        ">> Error while following: ",
        err,
        "takipten çıkılacak kullanıcı: ",
        req.body.followedid,
        "giriş yapmış kullanıcı: ",
        req.user.id
      );
      res.json("ERROR");
    });
});
router.post("/follow/", validateToken, async (req, res) => {
  await Users.findByPk(req.body.followedid)
    .then((followed) => {
      if (!followed) {
        console.log("followed not found!+" + req.body.followedid); //oturum açmış kullanıcının idsi
        req.json("ERROR");
      }
      Users.findByPk(req.user.id).then((follower) => {
        //user id tokenden alınabilir
        if (!follower) {
          console.log("follower not found!+" + req.user.id);
          req.json("ERROR");
        }
        console.log(`>> FOLLOWED ID=${followed.id} FOLLOWER ID=${follower.id}`);
        follower.addFollower(followed);

        res.json("SUCCESS");
      });
    })
    .catch((err) => {
      console.log(
        ">> Error while following: ",
        err,
        "giriş yapmış kullanıcı: ",
        req.user,
        "takip edilecek kullanıcı: ",
        req.body.followedid
      );
      res.json("ERROR");
    });
});
router.get("/usersearch", async (req, res) => {
  const { username } = req.query;

  const users = await Users.findAll({
    where: {
      username: {
        [Op.like]: `${username}%`,
      },
    },
    limit: 5,
  });

  if (!users) res.json({ error: "User Doesn't Exist" });
  res.json(users);
});
router.get("/usersearch", async (req, res) => {
  const { username } = req.query;

  const users = await Users.findAll({
    where: {
      username: {
        [Op.like]: `${username}%`,
      },
    },
    limit: 5,
  });

  if (!users) res.json({ error: "User Doesn't Exist" });
  res.json(users);
});
router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.get("/followedposts", validateToken, async (req, res) => {
  const id = req.user.id;
  const listofFollowedposts = await Users.findByPk(id, {
    include: [
      {
        model: Users,
        as: "follower",
        include: {
          model: Posts,
          include: [
            { model: Likes },
            { model: Medias },
            {
              model: Users,
              attributes: ["username"], // Sadece username alanını al
            },
          ],
        },
      },
    ],
  }).catch((err) => res.json(err));

  // listofFollowedposts null ise hata mesajı döndür
  if (!listofFollowedposts) {
    return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  }

  const allPosts = listofFollowedposts.follower.map(
    (follower) => follower.Posts
  );
  console.log("followedposts", req.user.id);
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  const olddata = {
    listOfPosts: allPosts,
    likedPosts: likedPosts,
  };
  const newData = {
    listOfPosts: olddata.listOfPosts.map((postArray) => postArray[0]) || [],
    likedPosts: olddata.likedPosts || [],
    
  };
  console.log("newData", newData);
  res.json(newData);
});

module.exports = router;
