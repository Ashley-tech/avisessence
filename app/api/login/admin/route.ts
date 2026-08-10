import { NextResponse, NextRequest } from 'next/server'
import HttpStatusCode from '../../../../lib/ts_HTTP/HttpStatusCode'
import * as mongo from '../../../../lib/ts_mongdb_client_connect/mongo_client_connect'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest, { params }: { params: { collection: string } }): Promise<NextResponse> {
  const method = request.method
  const { login, password } = await request.json()

  const user = await mongo.find("db_essence","users", {login: login, password: password, type: "Administrator"})
  console.log("user", user)
  if (!user || (Array.isArray(user) && user.length == 0)) {
    return NextResponse.json(
      {
        success: false,
        raison: 'Invalid login or password'
      },
      {
        status: HttpStatusCode.UNAUTHORIZED
      }
    )
  }

  return NextResponse.json(
    {
      success: true,
      raison: 'Login successful',
      data: user
    },
    {
      status: HttpStatusCode.OK
    }
  )
}

export async function PATCH(request: NextRequest, { params }: { params: { collection: string } }): Promise<NextResponse> {
  const method = await request.method
  try {
      const { login, mail, password } = await request.json()
      const updateData: any = {}

      if (login) updateData.login = login
      if (mail) updateData.mail = mail
      if (password) updateData.password = password

      if (Object.keys(updateData).length > 0) {
        await mongo.updateOne("db_essence", "users", { type: "Administrator" }, { $set: updateData })
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