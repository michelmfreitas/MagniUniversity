/* eslint-disable no-unused-vars */
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
import { professores as ProfessoresData } from '../../dummyData/professores'
import { ProfessoresProps } from '../../types/professores'
import uuid from 'react-uuid'

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

export default function Professores() {
  const [modalIsOpen, setIsOpen] = useState(false)
  const [professores, setProfessores] = useState<Array<ProfessoresProps>>([])
  const [error, setError] = useState<string>('')
  const [modalContent, setModalContent] = useState<ReactNode | null>('')

  useEffect(() => {
    // if exists localstorage data , load it
    // or load data from dummy data
    const DBProfessores = localStorage.getItem('professores')
      ? JSON.parse(localStorage.getItem('professores') || '')
      : ProfessoresData
    if (!localStorage.getItem('professores')) {
      localStorage.setItem('professores', JSON.stringify(DBProfessores))
    }
    setProfessores(DBProfessores)
  }, [setProfessores])

  // modal form from new course
  const ModalNewProfessor = (professor?: any) => {
    return (
      <Box p="30px" width="100%">
        <Heading as="h1" mb="30px">
          Adicionar Professor
        </Heading>
        <form onSubmit={HandleCreateNewProfessor} method="POST">
          {professor?.item?.id !== 'undefined' && (
            <input type="hidden" name="id" defaultValue={professor?.item?.id} />
          )}
          <Box className="input-group">
            <label>Nome do professor:</label>
            <Input
              type="text"
              name="professor"
              placeholder="Digite o nome do professor"
              defaultValue={professor?.item?.name}
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
              defaultValue={professor?.item?.birthday}
              required
            />
            <span className="input-group__error">Error</span>
          </Box>
          <Box className="input-group">
            <label>Salário</label>
            <Input
              type="number"
              name="amount"
              placeholder="Salário"
              defaultValue={professor?.item?.amount}
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
  const ModalDeleteProfessor = ({ item }: any) => {
    return (
      <Box p="30px" width="100%">
        <Text mb="20px" textAlign="center">
          Tem certeza que deseja remover este professor?
        </Text>
        <Box className="btn-container center">
          <Button className="btn" onClick={() => closeModal()}>
            Cancelar
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() => HandleDeleteProfessor(item)}
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
  function openModal(content?: string | void, professor?: ProfessoresProps) {
    setIsOpen(true)
    // if content is delete, shows the delete confirmation options
    if (content === 'delete') {
      setModalContent(<ModalDeleteProfessor item={professor} />)
    } else {
      setModalContent(<ModalNewProfessor item={professor} />)
    }
  }

  // create a new course
  function HandleCreateNewProfessor(e: any) {
    e.preventDefault()
    const name = e.target.professor.value
    const birthday = e.target.birthday.value
    const id = e.target.id.value
    const amount = e.target.amount.value

    const newItem: ProfessoresProps = {
      id: id === '' ? uuid() : id,
      name,
      birthday,
      amount,
    }
    const newArray = professores
    if (id === '') {
      newArray.push(newItem)
    } else {
      const index = professores.findIndex((item) => {
        return item.id === id
      })
      if (index !== -1) {
        newArray[index].name = name
        newArray[index].birthday = birthday
        newArray[index].amount = amount
      }
    }
    localStorage.setItem('professores', JSON.stringify(newArray))
    setProfessores(newArray)
    closeModal()
  }

  // delete course function
  const HandleDeleteProfessor = ({ id }: any) => {
    const newArray = professores.filter((current: any) => current.id !== id)
    localStorage.setItem('professores', JSON.stringify(newArray))
    setProfessores(newArray)
    closeModal()
  }

  return (
    <Layout title="Professores">
      <div id="main">
        <Flex justifyContent="space-between" alignItems="center" mb="50px">
          <Heading fontSize="32px">Professores</Heading>
          <Button className="btn btn-primary" onClick={() => openModal()}>
            + Adicionar Professor
          </Button>
        </Flex>
        <Box>
          <Table className="table">
            <Thead>
              <Tr>
                <Th colSpan={4}>Professores</Th>
              </Tr>
            </Thead>
            <Tbody>
              {professores &&
                professores.map((item: ProfessoresProps) => {
                  return (
                    <Tr key={item.id}>
                      <Td>{item.name}</Td>
                      <Td>{item.amount}</Td>
                      <Td>
                        <Moment format="DD/MM/YYYY">{item.birthday}</Moment>
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
