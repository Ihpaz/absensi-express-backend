import { DataTypes,Model} from "sequelize";
import connection from "../../config/dbConnect";
import Posisi from "./Posisi";
import Role from "./Role";


class Karyawan extends Model<any,any>{
  public id!:number;
  public nama!:string;
  public email!:string;
  public nohp!:string;
  public password!:string;
	public Role: any;
} 


Karyawan.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nama:{
        type:DataTypes.STRING,
    },
    email:{
      type:DataTypes.STRING,
    },
    nohp:{
      type:DataTypes.STRING,
    },
    foto:{
      type:DataTypes.STRING,
    },
    password:{
      type:DataTypes.STRING,
    }
  },{
    sequelize: connection,
    underscored: false,
    tableName: 'mskaryawan',
})

Posisi.hasMany(Karyawan);
Karyawan.belongsTo(Posisi);

Role.hasMany(Karyawan);
Karyawan.belongsTo(Role);

export default Karyawan;

