module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Posts", {
    postText: {
      type: DataTypes.STRING(255),
    },
  });
  Post.associate = (models) => {
    Post.belongsTo(models.Users);
    Post.belongsTo(models.Medias);
    Post.hasMany(models.PostComments);
    //Post.belongsToMany(models.Users, { through: "Likes" });
    Post.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };

  return Post;
};
/* module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });

    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };
  return Posts;
};
 */
