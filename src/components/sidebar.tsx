import { Box, Heading, VStack } from '@chakra-ui/react'

const baseURL =
  process.env.NODE_ENV === 'development' ? '/' : process.env.PUBLIC_URL
console.log(process.env.PUBLIC_URL)

export default function Sidebar() {
  return (
    <aside>
      <Box bg="#f7f7f7" p="50px" h="100vh">
        <Heading border="2px solid #ED0D14" p="15px" bg="#FFFFFF" mb="50px">
          Magni<span>University</span>
        </Heading>
        <VStack as="nav" align="left">
          <a href={baseURL}>Dashboard</a>
          <a href={`${baseURL}/#/cursos`}>Cursos</a>
          <a href="#/disciplinas">Disciplinas</a>
          <a href="#/professores">Professores</a>
          <a href="#/alunos">Alunos</a>
        </VStack>
      </Box>
    </aside>
  )
}
