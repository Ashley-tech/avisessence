import { NextResponse, NextRequest } from 'next/server'
import HttpStatusCode from '../../../lib/ts_HTTP/HttpStatusCode'
import * as mongo from '../../../lib/ts_mongdb_client_connect/mongo_client_connect'
import { MongoError } from 'mongodb'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const method = request.method
  const { mail } = await request.json()

  const user = await mongo.find("db_essence","users", {mail: mail, type: "Local"})
  if (!user || (Array.isArray(user) && user.length == 0)) {
    return NextResponse.json(
      {
        success: false,
        raison: 'User with this email does not exist'
      },
      {
        status: HttpStatusCode.UNAUTHORIZED
      }
    )
  }

  return NextResponse.json(
    {
      success: true,
      raison: 'User found',
      data: user
    },
    {
      status: HttpStatusCode.OK
    }
  )
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { mail, newPassword } = await request.json()

    if (!mail || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          raison: 'Both mail and newPassword must be provided'
        },
        {
          status: HttpStatusCode.BAD_REQUEST
        }
      )
    }

    const updateResult = await mongo.updateOne(
      'db_essence',
      'users',
      { mail, type: 'Local' },
      { $set: { password: newPassword } }
    )

    if (!updateResult || updateResult.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          raison: 'User with this email does not exist'
        },
        {
          status: HttpStatusCode.UNAUTHORIZED
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        raison: 'Password updated successfully'
      },
      {
        status: HttpStatusCode.OK
      }
    )
  } catch (error) {
    console.error('Forgot-password PATCH error:', error)

    return NextResponse.json(
      {
        success: false,
        raison: 'Internal server error'
      },
      {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR
      }
    )
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
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