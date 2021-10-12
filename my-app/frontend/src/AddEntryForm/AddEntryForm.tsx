import axios from 'axios';
import { Field, Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Button, Grid, Radio } from 'semantic-ui-react';
import { DiagnosisSelection, HealthcheckOption, SelectFieldHealthcheck, TextField } from '../AddPatientModal/FormField';
import { apiBaseUrl } from '../constants';
import { setActivePatient, useStateValue } from '../state';
import { Entry, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry } from "../types";

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

interface FieldValueAndTouched {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
    setFieldTouched: (field: string, isTouched?: boolean | undefined, shouldValidate?: boolean | undefined) => void;
}

type HospitalFormValues = Omit<HospitalEntry, 'id'>;
type HealthcheckFormValue = Omit<HealthCheckEntry, 'id'>;
type OccupationalHealthcareFormValues = Omit<OccupationalHealthcareEntry, 'id'>;
type AddEntryFormValues = HospitalFormValues | HealthcheckFormValue | OccupationalHealthcareFormValues;


interface OccupationalHealthcareProps {
    onSubmit: (values: OccupationalHealthcareFormValues) => void;
}

const OccupationalHealthcareForm = ({ onSubmit }: OccupationalHealthcareProps) => {
    return (
        <div>
            <Formik
                initialValues={{
                    description: '',
                    date: '',
                    specialist: '',
                    diagnosisCodes: [],
                    type: "OccupationalHealthcare",
                    employerName: '',
                    sickLeave: {
                        startDate: '',
                        endDate: ''
                    }
                }}
                onSubmit={onSubmit}
                validate={values => {
                    const requiredError = "Field is required";
                    const errors: { [field: string]: string } = {};
                    if (!values.description) errors.description = requiredError;
                    if (!values.date) errors.date = requiredError;
                    if (!isDate(values.date)) errors.date = 'Wrong format!';
                    if (!values.specialist) errors.specialist = requiredError;
                    if (!values.employerName) errors.employerName = requiredError;
                    // everything is using Yup on the internet, i'm not sure how to do this
                    // I couldn't find it in the course
                    if (!values.sickLeave?.startDate) errors['sickLeave.startDate'] = requiredError;
                    if (!values.sickLeave?.endDate) errors['sickLeave.endDate'] = requiredError;
                    return errors;
                }}
                >
                {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
                    return (
                        <Form className="form ui">
                            <AddBaseEntryForm setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} />
                            <Field
                                label="Employer name"
                                placeholder="Employer name"
                                name="employerName"
                                component={TextField}
                            />
                            <Field
                                label="Start date"
                                placeholder="YYYY-MM-DD"
                                name="sickLeave.startDate"
                                component={TextField}
                            />
                            <Field
                                label="End date"
                                placeholder="YYYY-MM-DD"
                                name="sickLeave.endDate"
                                component={TextField}
                            />
                            <Grid>
                                <Grid.Column floated="right" width={5}>
                                    <Button
                                        type="submit"
                                        floated="right"
                                        color="green"
                                        disabled={!dirty || !isValid}
                                    >
                                        Add
                                    </Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

interface HealthcheckFormProps {
    onSubmit: (values: HealthcheckFormValue) => void;
}

const healthcheckOptions: HealthcheckOption[] = [
    { value: HealthCheckRating.Healthy, label: "Healthy" },
    { value: HealthCheckRating.LowRisk, label: "Low risk" },
    { value: HealthCheckRating.HighRisk, label: "High risk" },
    { value: HealthCheckRating.CriticalRisk, label: "Critical risk" },
];

const isHelathCheckRating = (param: any): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(param);
};

const HealthcheckForm = ({ onSubmit }: HealthcheckFormProps) => {
    return (
        <div>
            <Formik
                initialValues={{
                    description: '',
                    date: '',
                    specialist: '',
                    diagnosisCodes: [],
                    type: "HealthCheck",
                    healthCheckRating: HealthCheckRating.LowRisk
                }}
                onSubmit={onSubmit}
                validate={values => {
                    const requiredError = "Field is required";
                    const errors: { [field: string]: string } = {};
                    if (!values.description) errors.description = requiredError;
                    if (!values.date) errors.date = requiredError;
                    if (!isDate(values.date)) errors.date = 'Wrong format!';
                    if (!values.specialist) errors.specialist = requiredError;
                    if (!values.healthCheckRating) errors.healthCheckRating = requiredError;
                    if (!isHelathCheckRating(values.healthCheckRating)) errors.healthCheckRating = 'Wrong format!';
                    return errors;
                }}
                >
                {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
                    return (
                        <Form className="form ui">
                            <AddBaseEntryForm setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} />
                            
                            <SelectFieldHealthcheck
                                label="Health check rating"
                                name="healthCheckRating"
                                options={healthcheckOptions}
                            />
                            <Grid>
                                <Grid.Column floated="right" width={5}>
                                    <Button
                                        type="submit"
                                        floated="right"
                                        color="green"
                                        disabled={!dirty || !isValid}
                                    >
                                        Add
                                    </Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

interface HospitalFormProps {
    onSubmit: (values: HospitalFormValues) => void;
}

const HospitalForm = ({ onSubmit }: HospitalFormProps) => {
    return (
        <div>
            <Formik
                initialValues={{
                    description: '',
                    date: '',
                    specialist: '',
                    discharge: {
                        criteria:'',
                        date: ''
                    },
                    diagnosisCodes: [],
                    type: "Hospital"
                }}
                onSubmit={onSubmit}
                validate={values => {
                    const requiredError = "Field is required";
                    const errors: { [field: string]: string } = {};
                    if (!values.description) errors.description = requiredError;
                    if (!values.date) errors.date = requiredError;
                    if (!isDate(values.date)) errors.date = 'Wrong format!';
                    if (!values.specialist) errors.specialist = requiredError;
                    // everything is using Yup on the internet, i'm not sure how to do this
                    // I couldn't find it in the course
                    if (!values.discharge.criteria) errors['discharge.criteria'] = requiredError;
                    if (!values.discharge.date) errors['discharge.date'] = requiredError;
                    return errors;
                }}
                >
                {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
                    return (
                        <Form className="form ui">
                            <AddBaseEntryForm setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} />
                            <Field
                                label="Discharge criteria"
                                placeholder="Criteria"
                                name="discharge.criteria"
                                component={TextField}
                            />
                            <Field
                                label="Discharge date"
                                placeholder="YYYY-MM-DD"
                                name="discharge.date"
                                component={TextField}
                            />
                            <Grid>
                                <Grid.Column floated="right" width={5}>
                                    <Button
                                        type="submit"
                                        floated="right"
                                        color="green"
                                        disabled={!dirty || !isValid}
                                    >
                                        Add
                                    </Button>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

const AddBaseEntryForm = ({ setFieldValue, setFieldTouched } : FieldValueAndTouched) => {
    const [{ diagnoses }] = useStateValue();

    return (
        <div>
            <Field
                label="Description"
                placeholder="Description"
                name="description"
                component={TextField}
            />
            <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="date"
                component={TextField}
            />
            <Field
                label="Specialist"
                placeholder="Specialist"
                name="specialist"
                component={TextField}
            />
            <DiagnosisSelection
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                diagnoses={Object.values(diagnoses)}
            />
        </div>
    );
};

const AddEntryForm = () => {
    const [{ activePatient }, dispatch] = useStateValue();
    const { id } = useParams<{ id: string }>();
    const [formType, setFormType] = useState('OccupationalHealthcare');

    const onFormSubmit = async (formValues: AddEntryFormValues) => {
        try {
            const { data: newEntry } = await axios.post<Entry>(
                `${apiBaseUrl}/patients/${id}/entries`,
                formValues
            );

            if (activePatient !== undefined) {
                const newActivePatient = {
                    ...activePatient,
                    entries: activePatient.entries.concat(newEntry)
                };
                dispatch(setActivePatient(newActivePatient));
            }
        } catch (exception: any) {
            console.error(exception.response?.data || 'Unknown Error');
            // setError(e.response?.data?.error || 'Unknown error');
        }
    };

    return (
        <div>
            <h1>Add new entry</h1>
            <br />
            <Radio
                label='Hospital'
                name='radioGroup'
                value='Hospital'
                checked={formType === 'Hospital'}
                onChange={(e, { value }) => setFormType(value as string)}
            />
            <br />
            <Radio
                label='Health Check'
                name='radioGroup'
                value='HealthCheck'
                checked={formType === 'HealthCheck'}
                onChange={(e, { value }) => setFormType(value as string)}
            />
            <br />
            <Radio
                label='Occupational Healthcare'
                name='radioGroup'
                value='OccupationalHealthcare'
                checked={formType === 'OccupationalHealthcare'}
                onChange={(e, { value }) => setFormType(value as string)}
            />
            <br />
            <br />
            {formType === 'Hospital' && (() => <HospitalForm onSubmit={onFormSubmit} />)()}
            {formType === 'HealthCheck' && (() => <HealthcheckForm onSubmit={onFormSubmit} />)()}
            {formType === 'OccupationalHealthcare' && (() => <OccupationalHealthcareForm onSubmit={onFormSubmit} />)()}
        </div>
    );
};

export default AddEntryForm;
