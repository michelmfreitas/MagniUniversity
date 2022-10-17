/* eslint-disable no-unused-vars */
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import Layout from '../Layout'
import { useEffect, useState } from 'react'
import { cursos as CoursesData } from '../../dummyData/cursos'
import { disciplinas as DisciplinasData } from '../../dummyData/disciplinas'
import { professores as ProfessoresData } from '../../dummyData/professores'
import { alunos as AlunosData } from '../../dummyData/alunos'
import { CourseProps } from '../../types/courses'
import { DisciplinasProps } from '../../types/disciplinas'
import { ProfessoresProps } from '../../types/professores'
import Moment from 'react-moment'
import { AlunosProps } from '../../types/alunos'

export default function Dashboard() {
  const [alunos, setAlunos] = useState<Array<AlunosProps>>([])
  const [courses, setCourses] = useState<Array<CourseProps>>([])
  const [disciplinas, setDisciplinas] = useState<Array<DisciplinasProps>>([])
  const [professores, setProfessores] = useState<Array<ProfessoresProps>>([])

  useEffect(() => {
    // if exists localstorage data , load it
    // or load data from dummy data
    const DBCourses = localStorage.getItem('courses')
      ? JSON.parse(localStorage.getItem('courses') || '')
      : CoursesData
    if (!localStorage.getItem('courses')) {
      localStorage.setItem('courses', JSON.stringify(DBCourses))
    }

    const DBDisciplinas = localStorage.getItem('disciplinas')
      ? JSON.parse(localStorage.getItem('disciplinas') || '')
      : DisciplinasData
    if (!localStorage.getItem('disciplinas')) {
      localStorage.setItem('disciplinas', JSON.stringify(DBDisciplinas))
    }

    const DBProfessores = localStorage.getItem('professores')
      ? JSON.parse(localStorage.getItem('professores') || '')
      : ProfessoresData
    if (!localStorage.getItem('professores')) {
      localStorage.setItem('professores', JSON.stringify(DBProfessores))
    }

    const DBAlunos = localStorage.getItem('alunos')
      ? JSON.parse(localStorage.getItem('alunos') || '')
      : AlunosData

    setAlunos(DBAlunos)
    setProfessores(DBProfessores)
    setCourses(DBCourses)
    setDisciplinas(DBDisciplinas)
  }, [setCourses])

  return (
    <Layout title="Dashboard">
      <small>
        You are running this application in <b>{process.env.NODE_ENV}</b> mode.
        <br />
        The base URL is <b>{process.env.PUBLIC_URL}</b>
      </small>
      <div id="main">
        <Flex justifyContent="space-between" alignItems="center" mb="50px">
          <Heading fontSize="32px">Dashboard</Heading>
        </Flex>
        <Box className="dashboard">
          <Grid className="dashboard-grid">
            <GridItem className="dashboard-grid__item">
              <h2>Cursos ({courses.length})</h2>
              <Table className="table">
                <Thead>
                  <Tr>
                    <Th>Curso</Th>
                    <Th>No. Semestres</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {courses.map((item) => {
                    return (
                      <Tr key={item.id}>
                        <Td w="50%">
                          <Text>
                            <a href={`/cursos/${item.slug}`}>{item.name}</a>
                          </Text>
                        </Td>
                        <Td w="50%">
                          {!item.semestres ? 0 : item.semestres?.length}
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </GridItem>
            <GridItem className="dashboard-grid__item">
              <h2>Disciplinas ({courses.length})</h2>
              <Table className="table">
                <Thead>
                  <Tr>
                    <Th>Disciplina</Th>
                    <Th>Professor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {disciplinas.map((item: any) => {
                    return (
                      <Tr key={item.id}>
                        <Td>
                          <Text>{item.name}</Text>
                        </Td>
                        <Td>
                          <Text>{item.professor[0]?.name}</Text>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </GridItem>
            <GridItem className="dashboard-grid__item">
              <h2>Professores ({professores.length})</h2>
              <Table className="table">
                <Thead>
                  <Tr>
                    <Th>Professor</Th>
                    <Th>Nascimento</Th>
                    <Th>Salário</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {professores.map((item: any) => {
                    return (
                      <Tr key={item.id}>
                        <Td>
                          <Text>{item.name}</Text>
                        </Td>
                        <Td>
                          <Text>
                            <Moment format="DD/MM/YYYY">{item.birthday}</Moment>
                          </Text>
                        </Td>
                        <Td>
                          <Text>
                            {item.amount.toLocaleString('pt-br', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </Text>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </GridItem>

            <GridItem className="dashboard-grid__item">
              <h2>Alunos ({alunos.length})</h2>
              <Table className="table">
                <Thead>
                  <Tr>
                    <Th>Matrícula</Th>
                    <Th>Aluno</Th>
                    <Th>Nascimento</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {alunos.map((item: any) => {
                    return (
                      <Tr key={item.id}>
                        <Td>
                          <Text>{item.register_number}</Text>
                        </Td>
                        <Td>
                          <Text>{item.name}</Text>
                        </Td>
                        <Td>
                          <Text>
                            <Moment format="DD/MM/YYYY">{item.birthday}</Moment>
                          </Text>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </GridItem>
          </Grid>
        </Box>
      </div>
    </Layout>
  )
}
