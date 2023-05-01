import React, { useRef, useEffect } from 'react';
import './Modal.css';
import SearchInput from '../search';

const Modal = ({ showModal, setShowModal,title,children,handleSearch }) => {
  const modalRef = useRef();

  const closeModal = () => {
    setShowModal(false);
  };

  // const handleClickOutside = (event) => {
  //   if (!event.target.closest('.modal-content')) {
  //      closeModal()
  //     }
  // };
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  return (
    <>
      {showModal && (
        <div className="modal" >
          <div className="modal_content" ref={modalRef} >
            <div className='modal_header'>
              <div className='modal_title'>{title}</div>
             <span className="close" onClick={closeModal}>&times;</span>
             
            </div>
            <SearchInput  handleChange={handleSearch} />
            <div className='modal_content_div'>
             {children}
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
