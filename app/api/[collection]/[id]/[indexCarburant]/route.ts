import { NextResponse, NextRequest } from 'next/server'
import HttpStatusCode from '../../../../../lib/ts_HTTP/HttpStatusCode'
import * as mongo from '../../../../../lib/ts_mongdb_client_connect/mongo_client_connect'
import {  ObjectId } from 'mongodb'

type StationCarburant = {
  avis?: Array<{
    noteSur5: number
    commentary?: string | null
    date?: string
    time?: string
  }>
}

type StationDocument = {
  carburants?: StationCarburant[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string, indexCarburant: number }> }
): Promise<NextResponse> {
  const { collection, id, indexCarburant } = await params
  return NextResponse.json(
    {
      success: false,
      raison: 'Method GET not allowed'
    },
    { status: HttpStatusCode.METHOD_NOT_ALLOWED }
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string, indexCarburant: number }> }
): Promise<NextResponse> {
  try {
    const { collection, id, indexCarburant } = await params
    if (!collection || !id || indexCarburant === undefined) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Collection, ID, and indexCarburant are required'
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Invalid station ID format'
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const objectId = new ObjectId(id)

    if (collection === 'stations') {
      const { note, commentary } = await request.json()
      console.log(note)
      if (note === undefined || note === null || typeof note !== 'number') {
        return NextResponse.json(
          {
            success: false,
            raison: 'Missing required field: note is required'
          },
          { status: HttpStatusCode.BAD_REQUEST }
        )
      }

      const data = (await mongo.find('db_essence', collection, { _id: objectId })) as unknown as StationDocument[] | null | undefined
      if (!data || data.length === 0) {
        return NextResponse.json(
          {
            success: false,
            raison: 'Resource not found'
          },
          { status: HttpStatusCode.NOT_FOUND }
        )
      }

      const station = data[0]
      const carburants = station?.carburants
      if (Array.isArray(carburants) && carburants.length > indexCarburant && indexCarburant >= 0) {
        const now = new Date()
        const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

        const carburant = carburants[indexCarburant]
        const avis = Array.isArray(carburant.avis) ? carburant.avis : []
        avis.push({
          noteSur5: note,
          commentary,
          date,
          time
        })
        carburant.avis = avis
        console.log(carburants)
        await mongo.updateOne('db_essence', collection, { _id: objectId }, { $set: { carburants } })
        return NextResponse.json(
          {
            success: true,
            raison: 'Carburant notice added successfully'
          },
          { status: HttpStatusCode.OK }
        )
      } else {
        return NextResponse.json(
          {
            success: false,
            raison: 'Carburant index out of bounds'
          },
          { status: HttpStatusCode.BAD_REQUEST }
        )
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          raison: `Collection ${collection} is not found or not allowed for update`
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        raison: 'Error updating resource'
      },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string, indexCarburant: number }> }
): Promise<NextResponse> {
  try {
    const { collection, id, indexCarburant } = await params
    if (!collection || !id || indexCarburant === undefined) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Collection, ID, and indexCarburant are required'
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const objectId = new ObjectId(id)

    if (collection === 'stations') {
      const { name, price } = await request.json()
      if (!name || typeof price !== 'number') {
        return NextResponse.json(
          {
            success: false,
            raison: 'Missing required fields: name and price are required'
          },
          { status: HttpStatusCode.BAD_REQUEST }
        )
      }
      const data = (await mongo.find("db_essence", collection, { _id: objectId })) as any
      if (!data || (Array.isArray(data) && data.length == 0)) {
        return NextResponse.json(
          {
            success: false,
            raison: 'Resource not found'
          },
          { status: HttpStatusCode.NOT_FOUND }
        )
      }
        if (data[0].carburants && Array.isArray(data[0].carburants) && data[0].carburants.length > indexCarburant && indexCarburant >= 0) {
            data[0].carburants[indexCarburant].name = name
            data[0].carburants[indexCarburant].price = price
            await mongo.updateOne("db_essence", collection, { _id: objectId }, {$set: {carburants: data[0].carburants}})
            return NextResponse.json(
                {
                    success: true,
                    raison: 'Carburant updated successfully'
                },
                { status: HttpStatusCode.OK }
            )
        } else {
            return NextResponse.json(
                {
                    success: false,
                    raison: 'Carburant index out of bounds'
                },
                { status: HttpStatusCode.BAD_REQUEST }
            )
        }
    } else {
      return NextResponse.json(
        {
          success: false,
          raison: `Collection ${collection} is not found or not allowed for update`
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        raison: 'Error updating resource'
      },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
): Promise<NextResponse> {
  const { collection, id } = await params
  return NextResponse.json(
    {
      success: false,
      raison: 'Method PUT not allowed'
    },
    { status: HttpStatusCode.METHOD_NOT_ALLOWED }
  )
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string, indexCarburant: number }> }
): Promise<NextResponse> {
  try {
    const { collection, id, indexCarburant } = await params
    if (!collection || !id || indexCarburant === undefined) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Collection, ID, and indexCarburant are required'
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const objectId = new ObjectId(id)

    if (collection === 'stations') {
      const data = await mongo.find("db_essence", collection, { _id: objectId })
      if (!data || (Array.isArray(data) && data.length == 0)) {
        return NextResponse.json(
          {
            success: false,
            raison: 'Resource not found'
          },
          { status: HttpStatusCode.NOT_FOUND }
        )
      }
        // normalize data[0] access to avoid TS 'implicit any' on JSON type
        const doc: any = Array.isArray(data) ? data[0] : data
        if (doc && doc.carburants && Array.isArray(doc.carburants) && doc.carburants.length > indexCarburant && indexCarburant >= 0) {
          doc.carburants.splice(indexCarburant, 1)
          await mongo.updateOne("db_essence", collection, { _id: objectId }, {$set: {carburants: doc.carburants}})
            return NextResponse.json(
                {
                    success: true,
                    raison: 'Carburant deleted successfully'
                },
                { status: HttpStatusCode.OK }
            )
        } else {
            return NextResponse.json(
                {
                    success: false,
                    raison: 'Carburant index out of bounds'
                },
                { status: HttpStatusCode.BAD_REQUEST }
            )
        }
    } else {
      return NextResponse.json(
        {
          success: false,
          raison: `Collection ${collection} is not found or not allowed for delete`
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        raison: 'Error deleting resource'
      },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR }
    )
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
): Promise<NextResponse> {
  const { collection, id } = await params
  return NextResponse.json(
    {
      success: false,
      raison: 'Method HEAD not allowed'
    },
    { status: HttpStatusCode.METHOD_NOT_ALLOWED }
  )
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
): Promise<NextResponse> {
  const { collection, id } = await params
  return NextResponse.json(
    {
      success: false,
      raison: 'Method OPTIONS not allowed'
    },
    { status: HttpStatusCode.METHOD_NOT_ALLOWED }
  )
}