import { exchangeCodeForTokens } from "@/src/lib/auth/google.auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //ON RECUEPERE LES QUERIES
  const { searchParams } = new URL(request.url);

  const cookieStore = await cookies();

  //ON LES DESTRUCTURE
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const cookieState = cookieStore.get("google-state");


  //ON CHECK LES POSSIBLES ERRORS
  if (!code) {
    console.log("NO CODE RECEIVED");
    return NextResponse.redirect("/auth-error/no-code");
  }

  if (error) {
    console.log("ERROR : ", error);
    return NextResponse.redirect("/auth-error/error");
  }

  if (!state || !cookieState || state !== cookieState.value) {
    console.log("STATE NOT MATCH : ", state, cookieState);
    return NextResponse.redirect("/auth-error/state-missmatch");
  }


  //SI C'EST OK ON DEMANDE UN TOKEN
  const tokens = await exchangeCodeForTokens(code);

  //SI CHECK SI ON A LE TOKEN
  if (!tokens) {
    console.log('NO ACCESS TOKENS RECEIVED');
    return NextResponse.redirect('/auth-error/no-tokens');
  }

  //ON RAJOUTE LA DATE LIMITE SUR LE TOKEN POUR POUVOIR
  //FACILEMENT CHECK S'IL EST TOUJOURS VALIDE
  const limitDate = Date.now() + ((tokens.expiry_date || 0) * 1000)

  //ON STOCKE TOUT CA DANS UN COOKIE
  await cookies().set('google-session', JSON.stringify({...tokens, limitDate}), {
    sameSite: true
  })

  //ET LE CODE AUSSI
  await cookies().set('google-code', code, {
    httpOnly: true
  })

  //ON REDIRIGE VERS UNE PAGE POUR POUVOIR RECUPERER TOUT CA DANS ZUSTAND
  const url = new URL("/auth-confirm/google", request.url);
  url.searchParams.set("code", code);
  url.searchParams.set("state", state);
  return NextResponse.redirect(url);
}
