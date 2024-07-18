import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ScheduleSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  birthDate: Yup.date().required('Data de nascimento é obrigatória'),
  date: Yup.date().required('Data é obrigatória'),
  time: Yup.string().required('Hora é obrigatória')
});

const ScheduleForm = ({ openModal, addSchedule }) => {
  const [startDate, setStartDate] = useState(new Date());

  const adjustDateForTimezone = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  return (
    <Formik
      initialValues={{ name: '', birthDate: '', date: '', time: '' }}
      validationSchema={ScheduleSchema}
      onSubmit={(values, { resetForm }) => {
        values.date = adjustDateForTimezone(startDate);

        axios.post('http://localhost:3000/schedule', values)
          .then(response => {
            console.log('Response:', response); 
            if (response.status === 201) {
              console.log('Agendamento criado com sucesso');
              openModal();
              addSchedule(values);  
              resetForm();
            } else {
              console.log('Resposta inesperada do servidor', response);
              alert('Erro ao criar agendamento');
            }
          })
          .catch(error => {
            console.error('Error:', error); 
            const errorMessage = error.response ? error.response.data : 'Erro ao criar agendamento';
            alert(`Erro: ${errorMessage}`);
          });
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <div>
            <label>Nome</label>
            <Field name="name" />
            {errors.name && touched.name ? (<div>{errors.name}</div>) : null}
          </div>
          <div>
            <label>Data de Nascimento</label>
            <Field name="birthDate" type="date" />
            {errors.birthDate && touched.birthDate ? (<div>{errors.birthDate}</div>) : null}
          </div>
          <div>
            <label>Data</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setFieldValue('date', date);
              }}
              dateFormat="yyyy-MM-dd"
            />
            {errors.date && touched.date ? (<div>{errors.date}</div>) : null}
          </div>
          <div>
            <label>Hora</label>
            <Field name="time" type="time" />
            {errors.time && touched.time ? (<div>{errors.time}</div>) : null}
          </div>
          <button type="submit">Agendar</button>
        </Form>
      )}
    </Formik>
  );
};

export default ScheduleForm;
