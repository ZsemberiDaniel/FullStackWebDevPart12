import express from 'express';
import patientService from '../services/patients';
import { toNewEntry, toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
    try {
        const newPatient = toNewPatient(req.body);
        const addedPatient = patientService.addEntry(newPatient);
        res.json(addedPatient);
    } catch (e: any) {
        res.status(400).send(e.message);
    }
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const patient = patientService.getEntry(id);

    if (patient) {
        res.status(200).json(patient);
    } else {
        res.status(404).send();
    }
});

router.post('/:id/entries', (req, res) => {
    const id = req.params.id;
    try {
        const entry = toNewEntry(req.body);
        const addedEntry = patientService.addEntryToPatient(id, entry);

        if (addedEntry) {
            res.status(200).json(addedEntry);
        } else {
            res.status(400).send();
        }
    } catch (exception: any) {
        res.status(400).send(exception.message);
    }
});

export default router;