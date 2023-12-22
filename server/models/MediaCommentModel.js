/* module.exports = (sequelize, DataTypes) => {
  const MediaCommentModel = sequelize.define("MediaComments", {

    UserComment: {
      type: DataTypes.STRING(255),
    },

  });
  MediaCommentModel.associate = (models) => {
    MediaCommentModel.belongsTo(models.Users);
    MediaCommentModel.belongsTo(models.Posts);
  };
  return MediaCommentModel;
};
 */
