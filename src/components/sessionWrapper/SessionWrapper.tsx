'use client';
import { SessionProvider } from 'next-auth/react';
import React, { FC } from 'react'

interface IProps {
  children : React.ReactNode
}

const SessionWrapper: FC<IProps> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default SessionWrapper