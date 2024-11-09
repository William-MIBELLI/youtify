import { AuthProvider } from "@/src/interface/auth.interface";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Body {
  stringifiedToken: string;
  provider: AuthProvider;
}

export async function POST(request: NextRequest) {

  const body = await request.json() as Body;
  const { provider, stringifiedToken } = body;
  console.log('REFRESH TOKEN ROUTE CALLED : ', provider);

  const cookieName = provider === 'google' ? 'google-session' : 'spotify-session';

  //DABORD ON LE DELETE
  const del = await cookies().delete(cookieName);

  //ENSUITE ON LE RECREE AVEC LA NOUVELLE VALEUR
  const ne = await cookies().set(cookieName, stringifiedToken, {
    httpOnly: true
  })

  // const value = await cookies().get(cookieName)?.value;

  // console.log(JSON.parse(value || 'PAs de value'))

  return NextResponse.json({ updated: true });
}