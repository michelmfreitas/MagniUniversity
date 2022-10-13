import { Box, Heading, VStack } from '@chakra-ui/react'

export default function Sidebar() {
  return (
    <aside>
      <Box bg="#f7f7f7" p="50px" h="100vh">
        <Heading border="2px solid #ED0D14" p="15px" bg="#FFFFFF" mb="50px">
          Magni<span>University</span>
        </Heading>
        <VStack as="nav" align="left">
          <a href="/">Cursos</a>
          <a href="/disciplinas">Disciplinas</a>
          <a href="/professores">Professores</a>
          <a href="/alunos">Alunos</a>
        </VStack>
      </Box>
    </aside>
  )
}
