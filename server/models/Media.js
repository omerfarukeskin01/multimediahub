module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define("Medias", {
    MediaNametext: {
      type: DataTypes.STRING(50),
    },
    MediaImages: {
      type: DataTypes.TEXT("long"),
    },
    MediaType: {
      type: DataTypes.STRING(31),
    },
  });

  Media.associate = (models) => {
    Media.hasOne(models.GameDetails, {
      foreignKey: "MediaID",
    });

    Media.hasMany(models.Posts);
    Media.hasOne(models.FilmDetails);
    Media.hasMany(models.MediaComments);
    Media.hasMany(models.Rating, {
      onDelete: "cascade",
    });
    Media.hasOne(models.SeriesDetails, {
      foreignKey: "MediaID",
    });
    Media.belongsToMany(models.Lists, {
      through: "ListMedia",
      foreignKey: "Mediaid",
    });
  };
  return Media;
};
