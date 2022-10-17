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
import Layout from '../Layout'
import { ReactNode, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { disciplinas as DisciplinasData } from '../../dummyData/disciplinas'
import { professores as ProfessoresData } from '../../dummyData/professores'
import { DisciplinasProps } from '../../types/disciplinas'
import uuid from 'react-uuid'
import { ProfessoresProps } from '../../types/professores'

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

export default function Disciplinas() {
  const [modalIsOpen, setIsOpen] = useState(false)
  const [disciplinas, setDisciplinas] = useState<Array<DisciplinasProps>>([])
  const [professores, setProfessores] = useState<Array<ProfessoresProps>>([])
  const [error] = useState<string>('')
  const [, setSelectProfessores] = useState(0)
  const [modalContent, setModalContent] = useState<ReactNode | null>('')

  useEffect(() => {
    // if exists localstorage data , load it
    // or load data from dummy data
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
    setProfessores(DBProfessores)

    setDisciplinas(DBDisciplinas)
  }, [setDisciplinas])

  const handleChangeSelect = (event: any) => {
    setSelectProfessores(event.target.value)
  }

  // modal form from new course
  const ModalNewDisciplina = (disciplina?: any) => {
    return (
      <Box p="30px" width="100%">
        <Heading as="h1" mb="30px">
          Adicionar Disciplina
        </Heading>
        <form onSubmit={HandleCreateNewDisciplina} method="POST">
          {disciplina?.item?.id !== 'undefined' && (
            <input
              type="hidden"
              name="id"
              defaultValue={disciplina?.item?.id}
            />
          )}
          <Box className="input-group">
            <label>Nome da disciplina:</label>
            <Input
              type="text"
              name="disciplina"
              placeholder="Digite o nome do disciplina"
              defaultValue={disciplina?.item?.name}
              required
            />
            <span className="input-group__error">{error}</span>
          </Box>
          <Box className="input-group">
            <label>Professor</label>
            <select
              name="professor"
              defaultValue={disciplina?.item?.professor[0].id}
              onChange={handleChangeSelect}
              required
            >
              <option value="">Selecione um professor para a disciplina</option>
              {professores.map((item: any) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                )
              })}
            </select>
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
  const ModalDeleteDisciplina = ({ item }: any) => {
    return (
      <Box p="30px" width="100%">
        <Text mb="20px" textAlign="center">
          Tem certeza que deseja remover esta disciplina?
        </Text>
        <Box className="btn-container center">
          <Button className="btn" onClick={() => closeModal()}>
            Cancelar
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() => HandleDeleteDisciplina(item)}
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
  function openModal(content?: string | void, disciplina?: DisciplinasProps) {
    setIsOpen(true)
    // if content is delete, shows the delete confirmation options
    if (content === 'delete') {
      setModalContent(<ModalDeleteDisciplina item={disciplina} />)
    } else {
      setModalContent(<ModalNewDisciplina item={disciplina} />)
    }
  }

  // create a new course
  function HandleCreateNewDisciplina(e: any) {
    e.preventDefault()
    const id = e.target.id.value
    const name = e.target.disciplina.value
    const idProfessor = e.target.professor.value
    const professor = professores.filter((item) => {
      return parseInt(item.id) === parseInt(idProfessor)
    })

    const newItem: DisciplinasProps = {
      id: id === '' ? uuid() : id,
      name,
      professor,
    }

    const newArray = disciplinas

    if (id === '') {
      newArray.push(newItem)
    } else {
      const index = disciplinas.findIndex((item) => {
        return parseInt(item.id) === parseInt(id)
      })
      if (index !== -1) {
        newArray[index].name = name
        newArray[index].professor = professor
      }
    }

    localStorage.setItem('disciplinas', JSON.stringify(newArray))
    setDisciplinas(newArray)
    closeModal()
  }

  // delete course function
  const HandleDeleteDisciplina = ({ name }: any) => {
    const newArray = disciplinas.filter((current: any) => current.name !== name)
    localStorage.setItem('disciplinas', JSON.stringify(newArray))
    setDisciplinas(newArray)
    closeModal()
  }

  return (
    <Layout title="Disciplinas">
      <div id="main">
        <Flex justifyContent="space-between" alignItems="center" mb="50px">
          <Heading fontSize="32px">Disciplinas</Heading>
          <Button className="btn btn-primary" onClick={() => openModal()}>
            + Adicionar Disciplina
          </Button>
        </Flex>
        <Box>
          <Table className="table">
            <Thead>
              <Tr>
                <Th colSpan={3}>Disciplinas</Th>
              </Tr>
            </Thead>
            <Tbody>
              {disciplinas &&
                disciplinas.map((item: any) => {
                  return (
                    <Tr key={item.name}>
                      <Td>{item.name}</Td>
                      <Td>{item.professor[0].name}</Td>
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
