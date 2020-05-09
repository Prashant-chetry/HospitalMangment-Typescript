/* eslint-disable @typescript-eslint/interface-name-prefix */
import React, { ReactNode } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Grid, Paper, IconButton, TextField, InputAdornment, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { History } from 'history';

interface FormikValue {
  email: string;
  password: string;
  reTypedPassword: string;
  showPassword: boolean;
  showRetypePassword: boolean;
}
const validationSchema = Yup.object().shape({
  email: Yup.string().email('please enter an email').required('required'),
  password: Yup.string().required('required').min(6),
  reTypedPassword: Yup.string().required('required').min(6),
});

interface IHsubmitProps {
  values: FormikValue;
  setSubmitting: (isSubmitting: boolean) => void;
  history: History;
}
const hSubmit = async function ({ values, setSubmitting, history }: IHsubmitProps): Promise<void> {
  if (!Object.keys(values).length) {
    setSubmitting(false);
    return;
  }
  try {
    const options: {
      method: string;
      headers: {
        'Content-Type': string;
      };
      body: string;
    } = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    };
    const url = history.location.pathname === '/signup' ? '/api/auth/signUp' : '/api/auth/logIn';
    const resp = await fetch(`http://localhost:8080${url}`, options);
    const body = await resp.json();
    if (!body.success) {
      switch (body.message) {
        case 'user already exists':
          history.push('/login');
          break;
        default:
          break;
      }
    } else {
      if (history.location.pathname === '/login' && body.accessToken) {
        window.localStorage.setItem('accessToken-HM', body.accessToken);
        window.localStorage.setItem('HS_userId', body.userId);
        history.push('/');
      }
    }
    console.log(body);
  } catch (error) {
    console.log(error);
  }
};
// eslint-disable-next-line react/prop-types
const AuthForm: React.FC<{ title?: string }> = function ({ title = 'Sign Up' }) {
  const initialValues: FormikValue = {
    email: '',
    password: '',
    reTypedPassword: '',
    showPassword: false,
    showRetypePassword: false,
  };
  const history = useHistory();

  return (
    <>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Paper style={{ padding: '1rem', width: '100%', marginTop: '2rem' }}>
            <Typography variant="h3" style={{ textAlign: 'center' }}>
              {title}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }): void => {
          hSubmit({ values, setSubmitting, history });
        }}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue }): ReactNode => (
          <Form>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
              spacing={3}
              style={{ padding: '3rem 0' }}
            >
              <Grid item xs={3} style={{ width: '100%' }}>
                <Field
                  name="email"
                  type="email"
                  variant="outlined"
                  label="Email :"
                  required
                  fullWidth
                  as={TextField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={3} style={{ width: '100%' }}>
                <Field
                  name="password"
                  type={values.showPassword ? 'text' : 'password'}
                  variant="outlined"
                  label="Password :"
                  required
                  fullWidth
                  as={TextField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setFieldValue('showPassword', !values.showPassword);
                          }}
                          edge="end"
                        >
                          {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={3} style={{ width: '100%' }}>
                <Field
                  name="reTypedPassword"
                  type={values.showRetypePassword ? 'text' : 'password'}
                  variant="outlined"
                  label="ReTypePassword :"
                  required
                  fullWidth
                  as={TextField}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={(): void => {
                            setFieldValue('showRetypePassword', !values.showRetypePassword);
                          }}
                          edge="end"
                        >
                          {values.showRetypePassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ padding: '2rem 0' }}>
              <Grid item>
                <Button type="submit" color="primary" variant="contained">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AuthForm;
