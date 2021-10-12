import patients from '../../data/patients';

import { Entry, NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types';
import { v1 as uuid } from 'uuid';

const getEntries = (): Array<Patient> => {
    return patients;
};

const getNonSensitiveEntries = (): Array<NonSensitivePatient> => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => {
        return {
            id, name, dateOfBirth, gender, occupation, entries
        };
    });
};

const getNonSensitiveEntry = (id: string): NonSensitivePatient | undefined => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => {
        return {
            id, name, dateOfBirth, gender, occupation, entries
        };
    }).find(p => p.id === id);
};

const getEntry = (id: string): Patient | undefined => {
    return patients.find(p => p.id === id);
};

const addEntry = (patient: NewPatient) => {
    const newPatient = {
        ...patient,
        id: uuid()
    };

    patients.push(newPatient);
    return newPatient;
};

const addEntryToPatient = (patientId: string, newEntry: NewEntry): Entry | undefined => {
    const patient = getEntry(patientId);
    if (!patient) return undefined;

    const entry: Entry = {
        ...newEntry,
        id: uuid()
    };
    patient.entries.push(entry);
    return entry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addEntry,
  getNonSensitiveEntry,
  getEntry,
  addEntryToPatient
};
