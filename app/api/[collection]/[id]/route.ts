import { NextResponse, NextRequest } from 'next/server'
import HttpStatusCode from '../../../../lib/ts_HTTP/HttpStatusCode'
import * as mongo from '../../../../lib/ts_mongdb_client_connect/mongo_client_connect'
import { MongoError, ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { collection, id } = await params
    if (!collection || !id) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Collection and ID are required'
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
    let objectId = new ObjectId(id)
    const data = await mongo.find("db_essence", collection, { _id: objectId })
    return NextResponse.json(
      {
        success: true,
        data: data
      },
      { status: HttpStatusCode.OK }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        raison: 'Error retrieving data'
      },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { collection, id } = await params
    if (!collection || !id) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Collection and ID are required'
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
    let objectId = new ObjectId(id)

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
      let data = await mongo.find("db_essence", collection, { _id: objectId })
      let carburants = data[0]?.carburants || []
      carburants.push({ name, price, avis: [] })

      await mongo.updateOne("db_essence", collection, { _id: objectId }, { $set: { carburants: carburants } })
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
  { params }: { params: Promise<{ collection: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { collection, id } = await params
    if (!collection || !id) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Collection and ID are required'
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }
    let objectId = new ObjectId(id)

    if (collection === 'users') {
      const { login, mail, password } = await request.json()
      const updateData: any = {}
      if (login) updateData.login = login
      if (mail) updateData.mail = mail
      if (password) updateData.password = password

      if (Object.keys(updateData).length > 0) {
        await mongo.updateOne("db_essence", collection, { _id: objectId }, { $set: updateData })
      }
    } else if (collection === 'stations') {
      const { name, mark, adress, postalCode, city, department, region } = await request.json()
      const newlocalization = {
        adress: adress,
        postalCode: postalCode,
        city: city,
        department: department,
        region: region
      }
      await mongo.updateOne("db_essence", collection, { _id: objectId }, { $set: { mark: mark, name: name, localisation: newlocalization } })
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
): Promise<NextResponse> {
  const { collection, id } = await params
  let objectId = new ObjectId(id)
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
  { params }: { params: Promise<{ collection: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { collection, id } = await params
    if (!collection || !id) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Collection and ID are required'
        },
        { status: HttpStatusCode.BAD_REQUEST }
      )
    }

    const queryId = ObjectId.isValid(id) ? new ObjectId(id) : id
    await mongo.findOneAndDelete("db_essence", collection, { _id: queryId })

    return NextResponse.json(
      {
        success: true,
        raison: 'Resource deleted successfully'
      },
      { status: HttpStatusCode.OK }
    )
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