/* eslint-disable @typescript-eslint/interface-name-prefix */
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { TextField, MenuItem, IconButton, InputAdornment, Grid, Button } from '@material-ui/core';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import isEmpty from '../../common/isEmpty';
import * as yup from 'yup';
import userValidationSchema from './validation';
interface IInitialValues {
  name: {
    first: string;
    last: string;
    middle: string;
  };
  gender: string;
  emails: Array<string>;
  mobileNos: Array<string>;
  dob: string;
  maritalStatus: string;
  aadharNo: string;
  panid: string;
}
interface IOption {
  code: string;
  label: string;
}
const genderOption: Array<IOption> = [
  { code: 'f', label: 'Female' },
  { code: 'm', label: 'Male' },
];
const maritalStatusOption: Array<IOption> = [
  { code: 's', label: 'Single' },
  { code: 'm', label: 'Married' },
];
const hSubmit = async function (
  values: IInitialValues,
  setSubmitting: (isSubmitting: boolean) => void,
  userId: string | undefined,
): Promise<void> {
  if (!Object.keys(values).length || !userId) {
    setSubmitting(false);
    return;
  }
  try {
    const options: {
      method: string;
      headers: {
        'Content-Type': string;
        authorization: string;
      };
      body: string;
    } = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('accessToken-HM') || '',
      },
      body: JSON.stringify(values),
    };
    const res = await (await fetch(`http://localhost:8080/api/user/edit/${userId}`, options)).json();
    console.log(res, 'resp');
  } catch (error) {
    console.error('error');
  }
};
const validationSchema = yup.object().shape({
  name: userValidationSchema.name,
  gender: userValidationSchema.gender,
  emails: userValidationSchema.emails,
  mobileNos: userValidationSchema.phones,
  dob: userValidationSchema.dob,
  maritalStatus: userValidationSchema.maritalStatus,
  aadharNo: userValidationSchema.aadharNo,
  panid: userValidationSchema.panid,
});

const EditUserProfile: React.FC = function () {
  const [userId, setUserId] = useState<undefined | string>(window.localStorage.getItem('HS_userId') || undefined);
  const [userInfo, setUserInfo] = useState<any | undefined>(undefined);
  useEffect(() => {
    if (userId) {
      const fetchData = async function (): Promise<void> {
        const requestHeader = new Headers();
        requestHeader.set('Content-Type', 'application/json');
        requestHeader.set('authorization', window.localStorage.getItem('accessToken-HM') || '');
        const resp = await (
          await fetch(`http://localhost:8080/api/user/profile/${userId}`, {
            method: 'GET',
            headers: requestHeader,
          })
        ).json();
        console.log(resp);
        if (!resp.success) {
          console.log('error', resp.message);
        } else setUserInfo(resp.data);
      };
      fetchData();
    }
  }, [userId]);
  if (isEmpty(userInfo || {})) return <span>Loading...</span>;
  const initialValues: IInitialValues = {
    name: {
      first: userInfo?.profile?.name?.first || '',
      last: userInfo?.profile?.name?.last || '',
      middle: userInfo?.profile?.name?.middle || '',
    },
    gender: userInfo?.profile?.gender || '',
    emails: userInfo.emails?.length ? userInfo.emails?.map((e: any) => e.address) : [''],
    mobileNos: userInfo.phones?.length ? userInfo.phones?.map((e: any) => e.number) : [''],
    dob: userInfo.profile.dob || '',
    maritalStatus: userInfo.profile?.maritalStatus || '',
    aadharNo: userInfo.profile?.aadharId || '',
    panid: userInfo.profile?.panid || '',
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }): void => {
        hSubmit(values, setSubmitting, userId);
      }}
    >
      {({ values, setFieldValue, dirty, isSubmitting, errors }): React.ReactNode => (
        <Form>
          <Grid container direction="column" spacing={3} style={{ marginTop: '2rem' }}>
            <Grid item container justify="center" spacing={3} xs={12}>
              <Grid item xs={3}>
                <Field
                  type="text"
                  name="name.first"
                  error={errors.name?.first ? true : false}
                  label="First Name :"
                  variant="outlined"
                  fullWidth
                  as={TextField}
                />
              </Grid>
              <Grid item xs={3}>
                <Field
                  type="text"
                  name="name.middle"
                  error={errors.name?.middle ? true : false}
                  label="Middle Name :"
                  variant="outlined"
                  fullWidth
                  as={TextField}
                />
              </Grid>
              <Grid item xs={3}>
                <Field
                  type="text"
                  name="name.last"
                  error={errors.name?.last ? true : false}
                  label="Last Name :"
                  variant="outlined"
                  fullWidth
                  as={TextField}
                />
              </Grid>
            </Grid>
            <Grid item container justify="center" spacing={3} xs={12}>
              <Grid item xs={3}>
                <Field
                  select
                  name="gender"
                  error={errors?.gender ? true : false}
                  label="Gender :"
                  variant="outlined"
                  fullWidth
                  as={TextField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(): void => {
                            setFieldValue('gender', '');
                          }}
                        >
                          <CancelRoundedIcon color="primary" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                >
                  {genderOption.map((g) => {
                    return (
                      <MenuItem key={g.code} value={g.code}>
                        {g.label}
                      </MenuItem>
                    );
                  })}
                </Field>
              </Grid>
              <Grid item xs={3}>
                <Field
                  select
                  name="maritalStatus"
                  label="Marital Status :"
                  variant="outlined"
                  fullWidth
                  error={errors?.maritalStatus ? true : false}
                  as={TextField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(): void => {
                            setFieldValue('maritalStatus', '');
                          }}
                        >
                          <CancelRoundedIcon color="primary" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                >
                  {maritalStatusOption.map((g) => {
                    return (
                      <MenuItem key={g.code} value={g.code}>
                        {g.label}
                      </MenuItem>
                    );
                  })}
                </Field>
              </Grid>
              <Grid item xs={3}>
                <Field
                  name="aadharNo"
                  type="text"
                  error={errors.aadharNo ? true : false}
                  label="Aadhar No :"
                  variant="outlined"
                  fullWidth
                  as={TextField}
                />
              </Grid>
            </Grid>
            <Grid item container justify="center" spacing={3} xs={12}>
              <Grid item xs={3}>
                <Field
                  type="date"
                  name="dob"
                  error={errors.dob ? true : false}
                  label="Dob: "
                  variant="outlined"
                  fullWidth
                  as={TextField}
                />
              </Grid>
              <Grid item xs={3}>
                <FieldArray
                  name="emails"
                  render={({ push, remove }): React.ReactNode => {
                    return values.emails.map((el, ind) => (
                      <Field
                        key={ind}
                        type="email"
                        label={ind === 0 ? 'Emails : ' : ''}
                        name={`emails.${ind}`}
                        error={errors.emails?.[ind] ? true : false}
                        variant="outlined"
                        fullWidth
                        as={TextField}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={(): void => {
                                  push('');
                                }}
                              >
                                <AddCircleRoundedIcon color="primary" />
                              </IconButton>
                              {values.emails.length > 1 && (
                                <IconButton
                                  onClick={(): void => {
                                    remove(ind);
                                  }}
                                >
                                  <RemoveCircleRoundedIcon color="primary" />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    ));
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <FieldArray
                  name="mobileNos"
                  render={({ push, remove }): React.ReactNode => {
                    return values.mobileNos.map((el, ind) => (
                      <Field
                        key={ind}
                        type="text"
                        label={ind === 0 ? 'Phones : ' : ''}
                        name={`mobileNos.${ind}`}
                        error={errors.mobileNos?.[ind] ? true : false}
                        variant="outlined"
                        fullWidth
                        as={TextField}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={(): void => {
                                  push('');
                                }}
                              >
                                <AddCircleRoundedIcon color="primary" />
                              </IconButton>
                              {values.mobileNos.length > 1 && (
                                <IconButton
                                  onClick={(): void => {
                                    remove(ind);
                                  }}
                                >
                                  <RemoveCircleRoundedIcon color="primary" />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    ));
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container justify="center" spacing={3} xs={12}>
              <Grid item xs={3}>
                <Field
                  name="panid"
                  type="text"
                  label="Pan Id :"
                  variant="outlined"
                  error={errors.panid ? true : false}
                  fullWidth
                  as={TextField}
                />
                <ErrorMessage name="panid" />
              </Grid>
            </Grid>
            <Grid item container justify="center" spacing={3} xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!dirty || isSubmitting || !isEmpty(errors)}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
          <pre>{JSON.stringify(values)}</pre>
          <pre>{JSON.stringify(errors)}</pre>
        </Form>
      )}
    </Formik>
  );
};
export default EditUserProfile;
