import { NextResponse, NextRequest } from 'next/server'
import HttpStatusCode from '../../../lib/ts_HTTP/HttpStatusCode'
import * as mongo from '../../../lib/ts_mongdb_client_connect/mongo_client_connect'
import { MongoError } from 'mongodb'

export async function GET(request: NextRequest, { params }: { params: { collection: string } }): Promise<NextResponse> {
  const method = request.method
  const pathname = new URL(request.url).pathname
  const collection = params.collection || pathname.split('/').filter(Boolean).pop() || ''

  if (!collection) {
    return NextResponse.json(
      {
        success: false,
        raison: 'Collection name is required in the route segment'
      },
      {
        status: HttpStatusCode.BAD_REQUEST
      }
    )
  }

  const data = await mongo.find("db_essence", collection, {})
  return NextResponse.json(
    {
      success: true,
      data: data
    },
    {
      status: HttpStatusCode.OK,
    }
  )
}

export async function POST(request: NextRequest, { params }: { params: { collection: string } }): Promise<NextResponse> {
  const method = request.method
  const pathname = new URL(request.url).pathname
  const collection = pathname.split('/').filter(Boolean).pop() || ''

  if (!collection) {
    return NextResponse.json(
      {
        success: false,
        raison: 'Collection name is required in the route segment'
      },
      {
        status: HttpStatusCode.BAD_REQUEST
      }
    )
  }

  if (collection == 'users') {
    const { login, mail, password } = await request.json()
    if (!login || !mail || !password) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Missing required fields: login, mail, and password are required'
        },
        {
          status: HttpStatusCode.BAD_REQUEST
        }
      )
    } else {
      const result = await mongo.insertOne(
        "db_essence",
        collection,
        { login: login, mail: mail, password: password, type: "Local", deleted: false }
      )

      if (!result || (result as any).acknowledged !== true) {
        return NextResponse.json(
          {
            success: false,
            raison: 'Unable to insert user into MongoDB',
            details: result
          },
          {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR
          }
        )
      }
    }
  } else if (collection == 'stations') {
    const { name, mark, adress, postalCode, city, department, region } = await request.json()
    if (!name || !mark || !adress || !postalCode || !city || !department || !region) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Missing required fields: name, mark, adress, postalCode, city, department, and region are required'
        },
        {
          status: HttpStatusCode.BAD_REQUEST
        }
      )
    } else {
      const result = await mongo.insertOne(
        "db_essence",
        collection,
        {
          name: name,
          mark: mark,
          localisation: {
            adress: adress,
            postalCode: postalCode,
            city: city,
            department: department,
            region: region
          },
          carburants: []
        }
      )

      if (!result || (result as any).acknowledged !== true) {
        return NextResponse.json(
          {
            success: false,
            raison: 'Unable to insert station into MongoDB',
            details: result
          },
          {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR
          }
        )
      }
    }
  } else {
    return NextResponse.json(
      {
        success: false,
        raison: 'Collection ' + collection + ' is not found or not allowed for insertion'
      },
      {
        status: HttpStatusCode.BAD_REQUEST
      }
    )
  }

  return NextResponse.json(
    {
      success: true,
      raison: collection + ' added successfully'
    },
    {
      status: HttpStatusCode.OK
    }
  )
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const method = await request.method
  return NextResponse.json(
    {
      success: false,
      raison: 'Method ' + method + ' not allowed'
    },
    {
      status: HttpStatusCode.METHOD_NOT_ALLOWED
    }
  )
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const method = await request.method
  return NextResponse.json(
    {
      success: false,
      raison: 'Method ' + method + ' not allowed'
    },
    {
      status: HttpStatusCode.METHOD_NOT_ALLOWED
    }
  )
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const method = await request.method
  return NextResponse.json(
    {
      success: false,
      raison: 'Method ' + method + ' not allowed'
    },
    {
      status: HttpStatusCode.METHOD_NOT_ALLOWED
    }
  )
}

export async function HEAD(request: NextRequest): Promise<NextResponse> {
  const method = await request.method
  return NextResponse.json(
    {
      success: false,
      raison: 'Method ' + method + ' not allowed'
    },
    {
      status: HttpStatusCode.METHOD_NOT_ALLOWED
    }
  )
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const method = await request.method
  return NextResponse.json(
    {
      success: false,
      raison: 'Method ' + method + ' not allowed'
    },
    {
      status: HttpStatusCode.METHOD_NOT_ALLOWED
    }
  )
}