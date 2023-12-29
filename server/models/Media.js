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
    Media.belongsTo(models.Users);
    Media.hasMany(models.Posts);
    Media.hasOne(models.FilmDetails);
    Media.hasMany(models.MediaComments);
    Media.belongsToMany(models.Lists, {
      through: "ListMedia",
      foreignKey: "Mediaid",
    });
  };
  return Media;
};
