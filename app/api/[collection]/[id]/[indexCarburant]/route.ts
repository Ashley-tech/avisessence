import { NextResponse, NextRequest } from 'next/server'
import HttpStatusCode from '../../../../../lib/ts_HTTP/HttpStatusCode'
import * as mongo from '../../../../../lib/ts_mongdb_client_connect/mongo_client_connect'
import { MongoError } from 'mongodb'

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

    if (collection === 'stations') {
      const { note, commentary } = await request.json()
      if (!note) {
        return NextResponse.json(
          {
            success: false,
            raison: 'Missing required field: note is required'
          },
          { status: HttpStatusCode.BAD_REQUEST }
        )
      }
      const data = await mongo.find("db_essence", collection, { _id: id.toString })
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
            const now = new Date()
            const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
            const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

            data[0].carburants[indexCarburant].avis.push({
                "note": note,
                "commentary": commentary,
                "date": date,
                "time": time
            })
            await mongo.findOneAndReplace("db_essence", collection, { _id: id.toString }, {$set: {carburants: data[0].carburants}})
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

    return NextResponse.json(
      {
        success: true,
        raison: 'Resource updated successfully'
      },
      { status: HttpStatusCode.OK }
    )
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

    if (collection === 'stations') {
      const { name, price } = await request.json()
      if (!name || !price) {
        return NextResponse.json(
          {
            success: false,
            raison: 'Missing required fields: name and price are required'
          },
          { status: HttpStatusCode.BAD_REQUEST }
        )
      }
      const data = await mongo.find("db_essence", collection, { _id: id.toString })
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
            await mongo.findOneAndReplace("db_essence", collection, { _id: id.toString }, {$set: {carburants: data[0].carburants}})
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

    if (collection === 'stations') {
      const { name } = await request.json()
      if (!name) {
        return NextResponse.json(
          {
            success: false,
            raison: 'Missing required field: name is required'
          },
          { status: HttpStatusCode.BAD_REQUEST }
        )
      }
      const data = await mongo.find("db_essence", collection, { _id: id.toString })
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
            data[0].carburants.splice(indexCarburant, 1)
            await mongo.findOneAndReplace("db_essence", collection, { _id: id.toString }, {$set: {carburants: data[0].carburants}})
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

    return NextResponse.json(
      {
        success: true,
        raison: 'Resource updated successfully'
      },
      { status: HttpStatusCode.OK }
    )
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