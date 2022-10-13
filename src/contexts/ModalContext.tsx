import React, { createContext, ReactNode, useState } from 'react'

interface ModalContextProps {
  children: ReactNode
}

type ModalContextType = {
  isOpenModal: boolean
  setIsOpenModal: (newState: boolean) => void
}

const initialValue = {
  isOpenModal: false,
  setIsOpenModal: () => {},
}

export const ModalContext = createContext<ModalContextType>(initialValue)

export const ModalContextProvider = ({ children }: ModalContextProps) => {
  const [isOpenModal, setIsOpenModal] = useState(initialValue.isOpenModal)

  return (
    <ModalContext.Provider value={{ isOpenModal, setIsOpenModal }}>
      {children}
    </ModalContext.Provider>
  )
}
