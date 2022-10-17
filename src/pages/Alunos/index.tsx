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
import { alunos as AlunosData } from '../../dummyData/alunos'
import { AlunosProps } from '../../types/alunos'
import uuid from 'react-uuid'
import { getRegisterNumber } from '../../utils/getRegisterNumber'

import Moment from 'react-moment'

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

export default function Alunos() {
  const [modalIsOpen, setIsOpen] = useState(false)
  const [alunos, setAlunos] = useState<Array<AlunosProps>>([])
  const [modalContent, setModalContent] = useState<ReactNode | null>('')

  useEffect(() => {
    // if exists localstorage data , load it
    // or load data from dummy data
    const DBAlunos = localStorage.getItem('alunos')
      ? JSON.parse(localStorage.getItem('alunos') || '')
      : AlunosData

    setAlunos(DBAlunos)
  }, [setAlunos])

  // modal form from new course
  const ModalNewAluno = (aluno?: any) => {
    return (
      <Box p="30px" width="100%">
        <Heading as="h1" mb="30px">
          Adicionar Aluno
        </Heading>
        <form onSubmit={HandleCreateNewAluno} method="POST">
          {aluno?.item?.id !== 'undefined' && (
            <input type="hidden" name="id" defaultValue={aluno?.item?.id} />
          )}
          <Box className="input-group">
            <label>Nome do aluno:</label>
            <Input
              type="text"
              name="aluno"
              placeholder="Digite o nome do aluno"
              defaultValue={aluno?.item?.name}
              required
            />
            <span className="input-group__error">Error</span>
          </Box>
          <Box className="input-group">
            <label>Data de nascimento</label>
            <Input
              type="date"
              name="birthday"
              placeholder="Data de nascimento"
              defaultValue={aluno?.item?.birthday}
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

  // modal confirmation from delete course
  const ModalDeleteAluno = ({ item }: any) => {
    return (
      <Box p="30px" width="100%">
        <Text mb="20px" textAlign="center">
          Tem certeza que deseja remover este aluno?
        </Text>
        <Box className="btn-container center">
          <Button className="btn" onClick={() => closeModal()}>
            Cancelar
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() => HandleDeleteAluno(item)}
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
  function openModal(content?: string | void, aluno?: AlunosProps) {
    setIsOpen(true)
    // if content is delete, shows the delete confirmation options
    if (content === 'delete') {
      setModalContent(<ModalDeleteAluno item={aluno} />)
    } else {
      setModalContent(<ModalNewAluno item={aluno} />)
    }
  }

  // create a new course
  function HandleCreateNewAluno(e: any) {
    e.preventDefault()
    const name = e.target.aluno.value
    const birthday = e.target.birthday.value
    const id = e.target.id.value
    const registerNumber = getRegisterNumber(alunos)

    const newItem: AlunosProps = {
      id: id === '' ? uuid() : id,
      name,
      birthday,
      register_number: registerNumber,
    }
    const newArray = alunos
    if (id === '') {
      newArray.push(newItem)
    } else {
      const index = alunos.findIndex((item) => {
        return item.id === id
      })
      if (index !== -1) {
        newArray[index].name = name
        newArray[index].birthday = birthday
      }
    }
    localStorage.setItem('alunos', JSON.stringify(newArray))
    setAlunos(newArray)
    closeModal()
  }

  // delete course function
  const HandleDeleteAluno = ({ id }: any) => {
    const newArray = alunos.filter((current: any) => current.id !== id)
    localStorage.setItem('alunos', JSON.stringify(newArray))
    setAlunos(newArray)
    closeModal()
  }

  return (
    <Layout title="Alunos">
      <div id="main">
        <Flex justifyContent="space-between" alignItems="center" mb="50px">
          <Heading fontSize="32px">Alunos</Heading>
          <Button className="btn btn-primary" onClick={() => openModal()}>
            + Adicionar Aluno
          </Button>
        </Flex>
        <Box>
          <Table className="table">
            <Thead>
              <Tr>
                <Th>Nome do aluno</Th>
                <Th>Matrícula</Th>
                <Th>Data de nascimento</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {alunos &&
                alunos.map((item: AlunosProps) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.name}</Td>
                      <Td>{item.register_number}</Td>
                      <Td>
                        <Moment format="DD/MM/YYYY">{item.birthday}</Moment>
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
