import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router';
import { Icon } from 'semantic-ui-react';
import AddEntryForm from '../AddEntryForm/AddEntryForm';
import { apiBaseUrl } from '../constants';
import { setActivePatient, useStateValue } from '../state';
import { Gender, Patient } from '../types';
import EntryDetails from './EntryDetails';

const DetailedPatientPage = () => {
    const { id } = useParams<{ id: string }>();
    const [{ activePatient }, dispatch] = useStateValue();
    React.useEffect(() => {  
      const fetchPatientList = async () => {
        if (activePatient && activePatient.id === id) {
            return;
        }
        try {
          const { data: patient } = await axios.get<Patient | undefined>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(setActivePatient(patient));
        } catch (e) {
          console.error(e);
        }
      };
      void fetchPatientList();
    }, [dispatch]);
    
    if (!activePatient)
      return (
        <div>Loading patient data...</div>
      );

    return (
        <div>
          <h2>{activePatient.name}</h2> 
          {activePatient.gender === Gender.Male && (() => <Icon name="mars"/>)()}
          {activePatient.gender === Gender.Female && (() => <Icon name="venus"/>)()}
          ssn: {activePatient.ssn} <br/>
          occupation: {activePatient.occupation}
          <h2>entries</h2>
          {activePatient.entries.map((entry, i) => <EntryDetails entry={entry} key={i} />)}

          <AddEntryForm />
        </div>
    );
};

export default DetailedPatientPage;
