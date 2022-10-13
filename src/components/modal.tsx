import { useState } from 'react'
import Modal from 'react-modal'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export default function ModalComponent({ content, isOpen }: any) {
  const [modalIsOpen, setIsOpen] = useState(isOpen)

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
      overlayClassName="overlayModal"
    >
      {content}
    </Modal>
  )
}
