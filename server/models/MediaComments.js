module.exports = (sequelize, DataTypes) => {
  const MediaComments = sequelize.define("MediaComments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  MediaComments.associate = (models) => {
    MediaComments.belongsTo(models.Users);
    MediaComments.belongsTo(models.Medias);
  };

  return MediaComments;
};
