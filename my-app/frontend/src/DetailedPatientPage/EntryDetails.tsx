import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../types';

function assertUnreachable(_x: never): never {
    throw new Error("Didn't expect to get here");
}

const HealthCheck = ({ entry } : { entry: HealthCheckEntry }) => {
    const [{ diagnoses }, ] = useStateValue();

    return (
        <div>
            <h2>{entry.date} <Icon name="doctor" /></h2>
            <p><i>{entry.description}</i></p>
            <ul>
                {entry.diagnosisCodes?.map((code, i) => <li key={i}>{code} {diagnoses[code] ? diagnoses[code].name : "No name"}</li>)}
            </ul>
            Rating: {entry.healthCheckRating}<br />
            Specialist: {entry.specialist} <br />
        </div>
    );
};

const Hospital = ({ entry } : { entry: HospitalEntry }) => {
    const [{ diagnoses }, ] = useStateValue();

    return (
        <div>
            <h2>{entry.date} <Icon name="user doctor" /></h2>
            <p><i>{entry.description}</i></p>
            <ul>
                {entry.diagnosisCodes?.map((code, i) => <li key={i}>{code} {diagnoses[code] ? diagnoses[code].name : "No name"}</li>)}
            </ul>
            Discharged on {entry.discharge.date} with reason: {entry.discharge.criteria}<br />
            Specialist: {entry.specialist} <br />
        </div>
    );
};

const OccupationalHealthcare = ({ entry } : { entry: OccupationalHealthcareEntry }) => {
    const [{ diagnoses }, ] = useStateValue();

    return (
        <div>
            <h2>{entry.date} <Icon name="stethoscope" /></h2>
            <p><i>{entry.description}</i></p>
            Employed by {entry.employerName}<br />
            <ul>
                {entry.diagnosisCodes?.map((code, i) => <li key={i}>{code} {diagnoses[code] ? diagnoses[code].name : "No name"}</li>)}
            </ul>
            Specialist: {entry.specialist} <br />
            {entry.sickLeave && (() => <div>Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</div>)()}<br />
        </div>
    );
};

type EntryDetailsProps = {
    entry: Entry;
};

const EntryDetails = (props: EntryDetailsProps) => {
    switch (props.entry.type) {
    case "HealthCheck":
        return <HealthCheck entry={props.entry} />;
    case "Hospital":
        return <Hospital entry={props.entry} />;
    case "OccupationalHealthcare":
        return <OccupationalHealthcare entry={props.entry} />;
    default: assertUnreachable(props.entry);
    }
};

export default EntryDetails;
