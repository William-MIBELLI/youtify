import AuthCompleteClient from '@/src/components/auth-complete/AuthCompleteClient';
import { getGoogleSession } from '@/src/lib/auth/google.auth';
import { cookies } from 'next/headers';
import React, { FC } from 'react'


interface IProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  }
}
const page: FC<IProps> = async ({ searchParams }) => {

  const { code, state } = searchParams;

  if (!code || !state) {
    return <div>
      Something wents wrong 🙃
    </div>
  }

  const serverState = await cookies().get('google-state');
  
  if (!serverState || serverState.value !== state) {
    return <div>
      Error With state 🙃
    </div>
  }
  const userData = await getGoogleSession();

  if (!userData) {
    return <div>
      No tokens
    </div>
  }


  return (
    <div>
      <h1>
        Authentication Success
      </h1>
      <AuthCompleteClient userData={userData}/>
    </div>
  )
}

export default page