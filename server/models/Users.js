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
    Userrole: {
      type: DataTypes.STRING(50),
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    User.hasMany(models.Medias);
    User.hasMany(models.Posts);
    User.hasMany(models.FilmDetails);

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
