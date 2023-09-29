import { DataTypes,Model} from "sequelize";
import connection from "../../config/dbConnect";

class Role extends Model{}
Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  role:{
    type:DataTypes.STRING,
  }
},{
  sequelize: connection,
  underscored: false,
  tableName: 'msrole',
})

export default Role;

