import React, { createContext, useContext } from 'react'
import { useFetchWithToken } from '../hooks/useFetchWithToken'
import { useFetchData } from '../hooks/useFetchData'

const AdminContext = createContext({})

export function AdminProvider({ children }) {
  const token = JSON.parse(localStorage.getItem('@ecoSempre-v1:token'))
  const isTokenExpires = token && token.expires <= new Date().getDate()

  const responsePosts = useFetchWithToken('/articles', token && token.token)
  const responseNewsletter = useFetchWithToken(
    '/newsletter',
    token && token.token,
  )
  const responseContacts = useFetchWithToken('/contacts', token && token.token)
  const responseCollectionPoints = useFetchData('/collection-points')

  if (!token) {
    return (
      <div className="p-4 font-bold text-2xl font-inter">Acesso restrito</div>
    )
  }

  if (isTokenExpires) {
    return (
      <div className="p-4 font-inter">
        <p className="font-bold text-2xl">Acesso expirou!</p>
        <p className="text-base font-normal max-w-xs mt-1 text-gray-700">
          Logue novamente para ter acesso ao painel de administrador!
        </p>
      </div>
    )
  }

  if (
    responsePosts.error ||
    responseCollectionPoints.error ||
    responseContacts.error ||
    responseNewsletter.error
  ) {
    return (
      <div className="font-roboto p-4 text-zinc-900 animate-pulse">
        Erro interno no servidor
      </div>
    )
  }

  if (
    responsePosts.isLoading ||
    responseCollectionPoints.isLoading ||
    responseContacts.isLoading ||
    responseNewsletter.isLoading
  ) {
    return (
      <div className="font-roboto p-4 text-zinc-900 animate-pulse">
        Carregando...
      </div>
    )
  }

  return (
    <AdminContext.Provider
      value={{
        posts: {
          ...responsePosts,
        },
        newsletter: {
          ...responseNewsletter,
        },
        contacts: {
          ...responseContacts,
        },
        collectionPoints: {
          ...responseCollectionPoints,
        },
        token,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
