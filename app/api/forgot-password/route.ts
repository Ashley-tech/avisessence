import { NextResponse, NextRequest } from 'next/server'
import HttpStatusCode from '../../../lib/ts_HTTP/HttpStatusCode'
import * as mongo from '../../../lib/ts_mongdb_client_connect/mongo_client_connect'
import { MongoError } from 'mongodb'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const method = request.method
  const { mail } = await request.json()

  const user = await mongo.find("db_essence","users", {mail: mail})
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
  const method = await request.method
  const { newMail, newPassword } = await request.json()
  if (!newMail && !newPassword) {
    return NextResponse.json(
      {
        success: false,
        raison: 'At least one of newMail or newPassword must be provided'
      },
      {
        status: HttpStatusCode.BAD_REQUEST
      }
    )
  }
  if (newMail) {
    await mongo.findOneAndReplace("db_essence", "users", { mail: newMail }, { $set: { mail: newMail } })
  }
  if (newPassword) {
    await mongo.findOneAndReplace("db_essence", "users", { mail: newMail }, { $set: { password: newPassword } })
  }
  return NextResponse.json(
    {
      success: true,
      raison: 'Mail or password updated successfully'
    },
    {
      status: HttpStatusCode.OK
    }
  )
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