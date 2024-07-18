import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ScheduleForm from './ScheduleForm';
import ScheduleList from './ScheduleList';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const MainApp = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addSchedule = (newSchedule) => {
    
  };

  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li>
              <Link to="/">Agendamento</Link>
            </li>
            <li>
              <Link to="/consultar">Consultar Agendamentos</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<SchedulePage openModal={openModal} addSchedule={addSchedule} />} />
          <Route path="/consultar" element={<ConsultaPage />} />
        </Routes>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Agendamento Criado"
        >
          <h2>Agendamento criado com sucesso!</h2>
          <button onClick={closeModal}>Fechar</button>
        </Modal>
      </div>
    </Router>
  );
};

const SchedulePage = ({ openModal, addSchedule }) => (
  <div>
    <h1>Agendamento de Vacinação</h1>
    <ScheduleForm openModal={openModal} addSchedule={addSchedule} />
  </div>
);

const ConsultaPage = () => (
  <div>
    <h1>Consulta de Agendamentos</h1>
    <ScheduleList />
  </div>
);

export default MainApp;
