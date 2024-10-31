'use client'

import React, { FC } from 'react'
import { SessionProvider } from 'next-auth/react'


interface IProps {
  children: React.ReactNode
}
const Container: FC<IProps> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default Container