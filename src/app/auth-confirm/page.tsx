import AuthCompleteClient from '@/src/components/auth-complete/AuthCompleteClient';
import { getTokensFromCookies } from '@/src/lib/request/spotify.request';
import React, { FC } from 'react'

interface IProps {
  searchParams: Promise<{[key: string] : string  | undefined }>
}
const page: FC<IProps> = async ({ searchParams }) => {
  
  const { state, code } = await searchParams;

  if (!state || !code) {
    return (
      <div>
        Something goes wrong 🙃
      </div>
    )
  }

  const token = await getTokensFromCookies(code, state);

  if (!token) {
    return <div>
      No tokens 🥲
    </div>
  }

  return (
    <div>
      <AuthCompleteClient token={token} />
    </div>
  )
}

export default page