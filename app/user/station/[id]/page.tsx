import Composant from "./composant"
import * as mongo from "@/lib/ts_mongdb_client_connect/mongo_client_connect"
import { ObjectId } from "mongodb"

export default async function Page({
  params,
}: {
  params: { id: string }
}) {

  const { id } = await params;

  const stationQuery = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : { _id: id };

  const stationDocs = (await mongo.find("db_essence", "stations", stationQuery)) as unknown as any[];
  const station = Array.isArray(stationDocs) ? stationDocs[0] : null;
  const users = (await mongo.find("db_essence", "users", {})) as unknown as any[];

  if (!station) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Station introuvable</h1>
        <p>Nous n'avons pas pu trouver la station demandée.</p>
      </div>
    );
  }

  return (
    <>
      <Composant station={station} users={users} />
    </>
  );
}