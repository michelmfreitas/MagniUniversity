/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Tbody,
  Text,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { ReactNode, SetStateAction, useEffect, useState } from 'react'
import Layout from '../Layout'
import Modal from 'react-modal'
import { CourseProps } from '../../types/courses'
import { ArrayOfObjects } from '../../utils/ArrayOfObjects'
import { disciplinas as DisciplinasData } from '../../dummyData/disciplinas'
import { DisciplinasProps } from '../../types/disciplinas'

// modal styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
  },
}

let disciplinasRelacionadas: any = []
let courses: any = []

export default function CursosDetails({ course }: any) {
  const [modalIsOpen, setIsOpen] = useState(false)
  const [courseDetails, setCourseDetails] = useState(course)
  const [modalContent, setModalContent] = useState<ReactNode | null>('')
  const [disciplinas, setDisciplinas] = useState<Array<DisciplinasProps>>([])

  useEffect(() => {
    // if exists localstorage data , load it
    // or load data from dummy data
    const DBDisciplinas = localStorage.getItem('disciplinas')
      ? JSON.parse(localStorage.getItem('disciplinas') || '')
      : DisciplinasData
    if (!localStorage.getItem('disciplinas')) {
      localStorage.setItem('disciplinas', JSON.stringify(DBDisciplinas))
    }

    courses = JSON.parse(localStorage.getItem('courses') || '')

    setDisciplinas(DBDisciplinas)
  }, [courseDetails])

  const handleChangeSelect = (e: any) => {
    const options = e.target.options
    const selectedDisciplinas: any = []
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedDisciplinas.push(options[i].value)
      }
    }
    const newArr = selectedDisciplinas.map((item: string) => {
      const res = disciplinas.filter((current) => {
        return current.id === item
      })
      return res[0]
    })
    disciplinasRelacionadas = newArr
    return newArr
  }

  const ModalNewSemestre = (item?: any) => {
    return (
      <Box p="30px" width="100%">
        <Heading as="h1" mb="30px">
          Adicionar Semestre
        </Heading>
        <form onSubmit={HandleCreateNewSemestre} method="POST">
          {item?.item?.semestre !== 'undefined' && (
            <input
              type="hidden"
              name="oldsemestre"
              defaultValue={item?.item?.semestre}
            />
          )}
          <Box className="input-group">
            <label>Semestre:</label>
            <Input
              type="number"
              name="semestre"
              placeholder="Qual é o semestre?"
              defaultValue={item?.item?.semestre}
              required
            />
            <span className="input-group__error">Error</span>
          </Box>
          <Box className="btn-container right">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </Box>
        </form>
      </Box>
    )
  }

  const ModalDisciplinas = (item?: any) => {
    return (
      <Box p="30px" width="100%">
        <Heading as="h1" mb="30px">
          Relacionar Disciplinas
        </Heading>
        <form onSubmit={HandleAddDisciplinasToSemestre} method="POST">
          {item?.item?.semestre !== 'undefined' && (
            <input
              type="hidden"
              name="semestre"
              defaultValue={item.item.semestre}
            />
          )}
          <Flex w="100%">
            <Box className="input-group" w="50%" mr="20px">
              <label>
                Selecione as disciplinas para o{' '}
                <strong>semestre {item.item.semestre}</strong>
              </label>
              <select
                name="disciplinas"
                multiple
                defaultValue={disciplinasRelacionadas}
                onChange={handleChangeSelect}
                required
              >
                {disciplinas.map((item: any) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  )
                })}
              </select>
              <span className="input-group__error"></span>
            </Box>
            {/* <Box
              border="1px solid #333333"
              p="10px 20px"
              w="50%"
              mt="33px"
              maxHeight="200px"
              bg="#333333"
              color="#FFFFFF"
            >
              array
            </Box> */}
          </Flex>

          <Box className="btn-container right">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </Box>
        </form>
      </Box>
    )
  }

  // modal confirmation from delete course
  const ModalDeleteSemestre = ({ item }: any) => {
    return (
      <Box p="30px" width="100%">
        <Text mb="20px" textAlign="center">
          Tem certeza que deseja remover este semestre?
        </Text>
        <Box className="btn-container center">
          <Button className="btn" onClick={() => closeModal()}>
            Cancelar
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() => HandleDeleteSemestre(item)}
          >
            Apagar
          </Button>
        </Box>
      </Box>
    )
  }

  // open modal function
  function openModal(content?: string | void, semestre?: Array<Object>) {
    setIsOpen(true)
    // if content is delete, shows the delete confirmation options
    if (content === 'delete') {
      setModalContent(<ModalDeleteSemestre item={semestre} />)
    } else if (content === 'disciplinas') {
      setModalContent(<ModalDisciplinas item={semestre} />)
    } else {
      setModalContent(<ModalNewSemestre item={semestre} />)
    }
  }

  function closeModal() {
    setIsOpen(false)
  }

  // create a new course
  function HandleCreateNewSemestre(e: any) {
    e.preventDefault()
    const editSemestre = parseInt(e.target.oldsemestre.value)
    const semestre = parseInt(e.target.semestre.value)
    let newSemestres = []

    // if exist value on oldsemestre field , edit the input
    if (editSemestre) {
      const idx = courseDetails.semestres.findIndex(
        (item: { semestre: number }) => {
          return editSemestre === item.semestre
        },
      )
      course.semestres[idx].semestre = semestre
      // update new item from cursos object
      const courses = JSON.parse(localStorage.getItem('courses') || '')
      const newArray = courses
      const index = courses.findIndex((item: CourseProps) => {
        return item.id === course.id
      })

      if (index !== -1) {
        newArray[index] = {
          ...course,
          semestres: course.semestres,
        }
        localStorage.setItem('courses', JSON.stringify(newArray))
        setCourseDetails(course)
        closeModal()
      }
    } else {
      const newItem = {
        semestre,
        disciplinas: [],
      }

      if (course.semestres) {
        // se exists semestre, create a new semestre

        const index = courseDetails.semestres.findIndex(
          (item: { semestre: number }) => {
            return semestre === item.semestre
          },
        )
        if (index === -1) {
          // not find a same semestre
          newSemestres = course.semestres
          newSemestres.push(newItem)
        }
      } else {
        // if not exists same semestre, it's create a new semestre
        newSemestres = [newItem]
        course.semestres = newSemestres
      }

      // update new item from cursos object
      const courses = JSON.parse(localStorage.getItem('courses') || '')
      const newArray = courses
      const index = courses.findIndex((item: CourseProps) => {
        return item.id === course.id
      })

      if (index !== -1) {
        newArray[index] = {
          ...course,
          semestres: newSemestres,
        }
        localStorage.setItem('courses', JSON.stringify(newArray))
        setCourseDetails(course)
        closeModal()
      }
    }
  }

  const HandleAddDisciplinasToSemestre = (e: any) => {
    e.preventDefault()
    const newSemestre: any = courseDetails
    const semestres = courseDetails.semestres

    const idx: number = courseDetails.semestres.findIndex(
      (item: { semestre: number }) => {
        return parseInt(e.target.semestre.value) === item.semestre
      },
    )
    newSemestre.semestres[idx].disciplinas = disciplinasRelacionadas

    // find index on courses and update the course
    const newArrCourses: any = courses
    const idxCourses = courses?.findIndex((item: CourseProps) => {
      return courseDetails.id === item.id
    })
    newArrCourses[idxCourses] = newSemestre
    localStorage.setItem('courses', JSON.stringify(newArrCourses))
    setCourseDetails(newSemestre)
    closeModal()
  }

  // delete course function
  const HandleDeleteSemestre = ({ semestre }: any) => {
    const newSemestres = course.semestres.filter(
      (current: any) => current.semestre !== semestre,
    )
    course.semestres = newSemestres
    // update new item from cursos object
    const courses = JSON.parse(localStorage.getItem('courses') || '')
    const newArray = courses
    const index = courses.findIndex((item: CourseProps) => {
      return item.id === course.id
    })

    if (index !== -1) {
      newArray[index] = {
        ...course,
        semestres: newSemestres,
      }
      localStorage.setItem('courses', JSON.stringify(newArray))
      setCourseDetails(course)
      closeModal()
    }
  }

  return (
    <Layout title={`Cursos - ${course.name}`}>
      <div id="main">
        <Flex justifyContent="space-between" alignItems="center" mb="50px">
          <Heading fontSize="32px">Curso: {course.name}</Heading>
          <Button className="btn btn-primary" onClick={() => openModal()}>
            + Adicionar Semestre
          </Button>
        </Flex>
        <Box>
          {!courseDetails.semestres ? (
            <Text>Ainda não há nenhum semestre cadastrado!</Text>
          ) : (
            <Table className="table">
              <Thead>
                <Tr>
                  <Th w="200px">Semestre</Th>
                  <Th colSpan={3} textAlign="left">
                    Disciplinas
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {courseDetails.semestres.map((item: any) => {
                  return (
                    <Tr key={item.semestre}>
                      <Td w="200px">{item.semestre}</Td>
                      <Td>
                        {item.disciplinas.map((item: any) => {
                          return <Text key={item.id}>{item.name}</Text>
                        })}
                      </Td>
                      <Td textAlign="right">
                        <a
                          href="#"
                          onClick={() => openModal('disciplinas', item)}
                        >
                          + adicionar disciplinas
                        </a>
                      </Td>
                      <Td>
                        <a
                          href="javascript:void(0)"
                          onClick={() => openModal('', item)}
                        >
                          editar
                        </a>
                        <a
                          href="javascript:void(0)"
                          onClick={() => openModal('delete', item)}
                        >
                          apagar
                        </a>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          )}
        </Box>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          ariaHideApp={false}
          overlayClassName="overlayModal"
        >
          {modalContent}
        </Modal>
      </div>
    </Layout>
  )
}
