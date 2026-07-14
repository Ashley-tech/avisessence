import Composant from "./composant"
import * as mongo from "@/lib/ts_mongdb_client_connect/mongo_client_connect"

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;

    async function getDatas(collection: string){
        let d= await mongo.find("db_essence",collection,{});
        return d
    }

    const datas = await getDatas("stations");

  return (
    <>
      <Composant stations={datas} />
      <p>ID de la station : {id}</p>
    </>
  );
}