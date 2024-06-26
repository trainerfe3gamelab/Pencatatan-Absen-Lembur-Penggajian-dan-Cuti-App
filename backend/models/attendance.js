module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        references: { model: "User", key: "id" },
        allowNull: false,
      },
      date: DataTypes.DATEONLY,
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time_in: DataTypes.TIME,
      time_out: DataTypes.TIME,
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      creation_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      update_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      update_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      create_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "tbl_attendances",
    }
  );

  Attendance.associate = function (models) {
    // associations can be defined here
    Attendance.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Attendance;
};
