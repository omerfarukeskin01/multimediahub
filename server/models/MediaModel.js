module.exports = (sequelize, DataTypes) => {
  const MediaModel = sequelize.define("Medias", {
    MediaNametext: {
      type: DataTypes.STRING(50),
    },
    MediaImages: {
      type: DataTypes.STRING(120),
    },
    MediaType: {
      type: DataTypes.STRING(31),
    },
  });
  MediaModel.associate = (models) => {
    MediaModel.belongsTo(models.Users);
    MediaModel.hasMany(models.Posts);
    MediaModel.hasOne(models.FilmDetails);
  };
  return MediaModel;
};
