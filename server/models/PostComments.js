module.exports = (sequelize, DataTypes) => {
  const PostComments = sequelize.define("PostComments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  PostComments.associate = (models) => {
    PostComments.belongsTo(models.Users);
    PostComments.belongsTo(models.Posts);
  };
  return PostComments;
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
