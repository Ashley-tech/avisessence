import Composant from "./composant"
import * as mongo from "@/lib/ts_mongdb_client_connect/mongo_client_connect"

export default async function Page({
  params,
}: {
  params: { id: string }
}) {

  const { id } = await params;

    async function getDatas(collection: string){
        let d= await mongo.find("db_essence",collection,{});
        return d
    }

    const datas = await getDatas("stations") as any[];
    const users = await getDatas("users");
    const index = (datas as any[]).findIndex((station: any) => station._id === id);

  return (
    <>
      <Composant station={datas[index]} users={users} />
    </>
  );
}