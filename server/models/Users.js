module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING(50),
    },
    Email: {
      type: DataTypes.STRING(50),
    },
    password: {
      type: DataTypes.STRING,
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    User.hasMany(models.Rating, {
      onDelete: "cascade",
    });
    User.belongsToMany(models.Users, {
      through: "Followers",
      as: "followed",
      foreignKey: "followedid",
    });
    User.belongsToMany(models.Users, {
      through: "Followers",
      as: "follower",
      foreignKey: "followerid",
    });

    User.hasMany(models.Posts);
    User.hasMany(models.MediaComments);
    User.hasMany(models.PostComments);

    //User.belongsToMany(models.Posts, { through: "Likes" });
  };

  return User;
};
/* module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Users;
};
 */
