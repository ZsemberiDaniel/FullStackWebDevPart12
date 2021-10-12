import { Gender, HealthCheckRating, NewBaseEntry, NewEntry, NewPatient } from "./types";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
    return Object.values(Gender).includes(param);
};

const isHelathCheckRating = (param: any): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(param);
};

const parseString = (str: unknown, name: string): string => {
    if (!str || !isString(str)) {
      throw new Error('Incorrect or missing parameter ' + name);
    }
  
    return str;
};

const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};

const parseStringArray = (arr: unknown, name: string): string[] => {
    if (!arr || !Array.isArray(arr)) {
        throw new Error(name + ' is not an array!');
    }
    let allString = true;
    arr.forEach(function(item){
        if (!isString(item)) {
            allString = false;
        }
    });
    if (!allString){
        throw new Error(name + ' is not a string array!');
    }

    return arr as string[];
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};

const parseHealthcheckRating = (healthCheckRating: unknown): HealthCheckRating => {
    if (!healthCheckRating || !isHelathCheckRating(healthCheckRating)) {
        throw new Error('Incorrect or missing healthCheckRating: ' + healthCheckRating);
    }
    return healthCheckRating;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewPatient = (body: any): NewPatient => {
    const newPatient: NewPatient = {
        name: parseString(body.name, 'name'),
        ssn: parseString(body.ssn, 'ssn'),
        occupation: parseString(body.occupation, 'occupation'),
        dateOfBirth: parseDate(body.dateOfBirth),
        gender: parseGender(body.gender),
        entries: []
    };

    return newPatient;
};

// const assertUnreachable = (_x: never): never => {
//     throw new Error("Didn't expect to get here");
// };

export const toNewEntry = (body: any): NewEntry => {
    const type = parseString(body.type, 'type');

    const newBaseEntry: NewBaseEntry = {
        description: parseString(body.description, 'description'),
        date: parseDate(body.date),
        specialist: parseString(body.specialist, 'specialist'),
        diagnosisCodes: body.diagnosisCodes ? parseStringArray(body.diagnosisCodes, 'diagnosisCodes') : undefined
    };

    let newEntry: NewEntry;
    switch (type) {
    case 'HealthCheck':
        newEntry = {
            ...newBaseEntry,
            type: 'HealthCheck',
            healthCheckRating: parseHealthcheckRating(body.healthCheckRating)
        };
        break;
    case 'Hospital':
        newEntry = {
            ...newBaseEntry,
            type: 'Hospital',
            discharge: {
                criteria: parseString(body.discharge.criteria, 'discharge.criteria'),
                date: parseDate(body.discharge.date)
            }
        };
        break;
    case 'OccupationalHealthcare':
        newEntry = {
            ...newBaseEntry,
            type: 'OccupationalHealthcare',
            employerName: parseString(body.employerName, 'employerName'),
            sickLeave: !body.sickLeave ? undefined : {
                startDate: parseDate(body.sickLeave.startDate),
                endDate: parseDate(body.sickLeave.endDate)
            }
        };
        break;
    default:
        throw new Error('Type of etry is unknown!');
    }
    
    return newEntry;
};
