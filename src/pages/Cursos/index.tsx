import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Text,
  Tr,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import Layout from '../Layout'
import { ReactNode, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { cursos as CoursesData } from '../../dummyData/cursos'
import { CourseProps } from '../../types/courses'
import uuid from 'react-uuid'
import { slugify } from '../../utils/createSlug'

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

export default function Cursos() {
  const [modalIsOpen, setIsOpen] = useState(false)
  const [courses, setCourses] = useState<Array<CourseProps>>([])
  const [error, setError] = useState<string>('')
  const [modalContent, setModalContent] = useState<ReactNode | null>('')

  useEffect(() => {
    // if exists localstorage data , load it
    // or load data from dummy data
    const DBCourses = localStorage.getItem('courses')
      ? JSON.parse(localStorage.getItem('courses') || '')
      : CoursesData
    if (!localStorage.getItem('courses')) {
      localStorage.setItem('courses', JSON.stringify(DBCourses))
    }
    setCourses(DBCourses)
  }, [setCourses])

  // modal form from new course
  const ModalNewCourse = (course?: any) => {
    return (
      <Box p="30px" width="100%">
        <Heading as="h1" mb="30px">
          Adicionar Curso
        </Heading>
        <form onSubmit={HandleCreateNewCourse} method="POST">
          {course?.item?.id !== 'undefined' && (
            <input type="hidden" name="id" defaultValue={course?.item?.id} />
          )}
          <Box className="input-group">
            <label>Nome do curso:</label>
            <Input
              type="text"
              name="course"
              placeholder="Digite o nome do curso"
              defaultValue={course?.item?.name}
            />
            <span className="input-group__error">{error}</span>
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

  // modal confirmation from delete course
  const ModalDeleteCourse = ({ item }: any) => {
    return (
      <Box p="30px" width="100%">
        <Text mb="20px" textAlign="center">
          Tem certeza que deseja apagar este curso?
        </Text>
        <Box className="btn-container center">
          <Button className="btn" onClick={() => closeModal()}>
            Cancelar
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() => HandleDeleteCourse(item)}
          >
            Apagar
          </Button>
        </Box>
      </Box>
    )
  }

  // close modal function
  function closeModal() {
    setIsOpen(false)
  }

  // open mdoal function
  function openModal(content?: string | void, course?: CourseProps) {
    setIsOpen(true)
    // if content is delete, shows the delete confirmation options
    if (content === 'delete') {
      setModalContent(<ModalDeleteCourse item={course} />)
    } else {
      setModalContent(<ModalNewCourse item={course} />)
    }
  }

  // create a new course
  function HandleCreateNewCourse(e: any) {
    e.preventDefault()
    const name = e.target.course.value
    const id = e.target.id.value

    // check if exists other course with same name
    const sameCourse = courses.findIndex((item) => {
      const str1 = item.name.replace(/[^a-zA-Z ]/g, '')
      const str2 = name.replace(/[^a-zA-Z ]/g, '')
      return str1 === str2
    })

    if (sameCourse === 1) {
      setError('Os nomes nao podem ser iguais')
    } else {
      const newItem: CourseProps = {
        id: id === '' ? uuid() : id,
        name,
        slug: slugify(name),
      }
      const newArray = courses
      if (id === '') {
        newArray.push(newItem)
      } else {
        const index = courses.findIndex((item) => {
          return item.id === id
        })
        if (index !== -1) {
          newArray[index].name = name
        }
      }
      localStorage.setItem('courses', JSON.stringify(newArray))
      setCourses(newArray)
      closeModal()
    }
  }

  // delete course function
  const HandleDeleteCourse = ({ id }: any) => {
    const newArray = courses.filter((current: any) => current.id !== id)
    localStorage.setItem('courses', JSON.stringify(newArray))
    setCourses(newArray)
    closeModal()
  }

  return (
    <Layout title="Cursos">
      <div id="main">
        <Flex justifyContent="space-between" alignItems="center" mb="50px">
          <Heading fontSize="32px">Cursos</Heading>
          <Button className="btn btn-primary" onClick={() => openModal()}>
            + Adicionar Curso
          </Button>
        </Flex>
        <Box>
          <Table className="table">
            <Thead>
              <Tr>
                <Th colSpan={2}>Cursos</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses &&
                courses.map((item: CourseProps) => {
                  return (
                    <Tr key={item.id}>
                      <Td>
                        <Link to={`#/cursos/${item.slug}`}>{item.name}</Link>
                        <Link to={`/${item.slug}`}>{item.name}</Link>
                      </Td>
                      <Td>
                        <a href="#" onClick={() => openModal('', item)}>
                          editar
                        </a>
                        <a href="#" onClick={() => openModal('delete', item)}>
                          apagar
                        </a>
                      </Td>
                    </Tr>
                  )
                })}
            </Tbody>
          </Table>
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
