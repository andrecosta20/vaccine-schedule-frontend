import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/schedules')
      .then(response => {
        setSchedules(response.data);
      })
      .catch(error => {
        alert('Erro ao carregar agendamentos');
      });
  }, []);

  const groupSchedules = (schedules) => {
    const grouped = {};

    schedules.forEach((schedule, index) => {
      const { date, time } = schedule;
      const key = `${date} ${time}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push({ ...schedule, index });
    });

    return grouped;
  };

  const groupedSchedules = groupSchedules(schedules);

  const handleStatusChange = (index, status) => {
    axios.put(`http://localhost:3000/schedule/${index}`, { status })
      .then(response => {
        const newSchedules = [...schedules];
        newSchedules[index].status = status;
        setSchedules(newSchedules);
      })
      .catch(error => {
        alert('Erro ao atualizar status do agendamento');
      });
  };

  return (
    <div>
      <h2>Agendamentos</h2>
      <ul>
        {Object.keys(groupedSchedules).map((key) => (
          <li key={key}>
            <strong>{key}</strong>
            <ul>
              {groupedSchedules[key].map((schedule, index) => (
                <li
                  key={index}
                  className={schedule.status === 'Realizado' ? 'realizado' : 'nao-realizado'}
                >
                  {schedule.name} - {schedule.birthDate} - {schedule.status}
                  <select
                    value={schedule.status}
                    onChange={(e) => handleStatusChange(schedule.index, e.target.value)}
                  >
                    <option value="Não realizado">Não realizado</option>
                    <option value="Realizado">Realizado</option>
                  </select>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleList;
