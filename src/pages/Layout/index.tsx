import { Box, HStack } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Sidebar from '../../components/sidebar'
import { ModalContextProvider } from '../../contexts/ModalContext'

interface PageProps {
  title: string
  children: ReactNode
}

export default function Layout({ title, children }: PageProps) {
  return (
    <ModalContextProvider>
      <HStack alignItems="flex-start">
        <Sidebar />
        <Box as="main" id="main" p="50px" w="100%" minHeight="100vh">
          {children}
        </Box>
      </HStack>
    </ModalContextProvider>
  )
}
