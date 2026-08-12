import Composant from "./composant"
import * as mongo from "@/lib/ts_mongdb_client_connect/mongo_client_connect"

export default async function Page({
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {

    async function getDatas(collection: string){
      return await mongo.find("db_essence", collection, {})
    }

    const datas = await getDatas("stations");
    const users = await getDatas("users");

  return (
    <>
      <Composant stations={datas} users={users} />
    </>
  );
}