import { Request,Response } from "express";
import Absen from "../db/models/Absen";
import { DateTime } from "luxon";
import Karyawan from "../db/models/Karyawan";
import { Op } from "sequelize";

interface CustomAuthRequest extends Request {
	auth?: { 
	  id: string;
    role: string;
    source:string;
	};
}


async function absen(req:CustomAuthRequest,res:Response){
  const now = DateTime.now();
 const currentDate = now.toFormat('yyyy-MM-dd');
  const auth=req.auth;
  try {

      const dtAbsen= await Absen.findOne({
        where:{
          KaryawanID:auth?.id,
          tglkerja:currentDate
        }
      });

      if(!dtAbsen){
        await Absen.create({
          KaryawanId:auth?.id,
          tglkerja:currentDate,
          tglabsenmasuk:now
        });
      }else{
        await Absen.update({
          tglabsenpulang:now
        },{
          where :{
            id:dtAbsen.id
          }
        });
      }

      return res.status(200).send({
        status:'success', 
        message:'Berhasil Absen'
      });

  } catch (error) {
    return res.status(500).send({
			status: 'error',
			message: 'internal server error',
		});
  }
}

async function getAllAbsen(req:CustomAuthRequest,res:Response){
  const auth=req.auth;
  const tglawal=req.query.tglawal;
  const tglakhir=req.query.tglakhir;
  try {
    
    const addWhere= auth?.role == 'admin' && req.headers['source']=='hradmin' ? 
    {
      where:{
              tglkerja:{
                          [Op.between]:[tglawal,tglakhir]
              }
      },
      limit:100,
      include:Karyawan
    }:
    {
      where:{
        tglkerja:{
            [Op.between]:[tglawal,tglakhir]
        },
        KaryawanId:auth?.id,
      },
      limit:100,
      include:Karyawan
    };

    const {count,rows}= await Absen.findAndCountAll(addWhere);
    
    return res.status(200).send({
			status:'success', 
		   message:'Berhasil mendapatkan data absen',
			data:rows,
			jumlah:count
	   });

  } catch (error) {
    return res.status(500).send({
			status: 'error',
			message: 'internal server error',
		});
  }
}

export default {absen,  getAllAbsen}