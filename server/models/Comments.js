module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Comments;
};
/*   module.exports = (sequelize, DataTypes) => {
    const PostCommentModel = sequelize.define("PostComments", {
      PostComment: {
        type: DataTypes.STRING(255),
      },
    });
    PostCommentModel.associate = (models) => {
      PostCommentModel.belongsTo(models.Users);
      PostCommentModel.belongsTo(models.Posts);
    };
    return PostCommentModel;
  };
   */
