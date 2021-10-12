import React from 'react';
import { useStateValue } from '../state';
import { Entry } from '../types';

type EntriesProp = {
  entry: Entry;
};

const Entries = (props: EntriesProp) => {
  const [{ diagnoses },] = useStateValue();

  return (
    <div>
      <p>{props.entry.date}: <i>{props.entry.description}</i></p>
      <ul>
          {props.entry.diagnosisCodes?.map((code, i) => <li key={i}>{code} {diagnoses[code] ? diagnoses[code].name : "No name"}</li>)}
      </ul>
    </div>
  );
};

export default Entries;
