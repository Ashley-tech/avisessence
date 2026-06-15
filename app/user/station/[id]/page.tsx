import Composant from "./composant"
import * as mongo from "@/lib/ts_mongdb_client_connect/mongo_client_connect"

export default async function Page() {

    async function getDatas(collection: string){
        let d= await mongo.find("db_essence",collection,{});
        return d
    }

    const datas = await getDatas("stations");
    const users = await getDatas("users");

  return (
    <>
      <Composant stations={datas} users={users} />
    </>
  );
}