import * as yup from 'yup';
const userValidationSchema = {
  name: yup.object().shape({
    first: yup
      .string()
      .required('first name required')
      .max(50, 'first name length must be max 50')
      .min(1, 'first name length must be max 1'),
    last: yup
      .string()
      .required('last name required')
      .max(50, 'last name length must be max 50')
      .min(1, 'last name length must be min 1'),
    middle: yup.string().max(50, 'middle name length must be max 50').min(1, 'middle name length must be min 1'),
  }),
  emails: yup
    .array()
    .of(yup.string().required('email is required').email('email is not valid').min(4, 'email length must be min 4')),
  phones: yup
    .array()
    .of(yup.string().min(10, 'phone no length must be min 10').max(13, 'phone no length must be max 13')),
  gender: yup
    .string()
    .length(1, 'gender length must be 1')
    .matches(/[f|m]{1}/, 'gender value'),
  maritalStatus: yup
    .string()
    .length(1, 'martialStatus length must be 1')
    .matches(/[s|m]{1}/, 'martialStatus not valid'),
  panid: yup
    .string()
    .length(10, 'panid length must be 10')
    .matches(/[A-Za-z]{3}[p|P]{1}[A-Za-z]{1}\d{4}[A-Za-z]{1}/g, 'panid not valid'),
  aadharNo: yup
    .string()
    .length(12, 'aadhar No length must be 12')
    .matches(/\d{12}/, 'addhar no not valid'),
  role: yup.array().of(
    yup
      .string()
      .max(4, 'role length must be min 10')
      .max(10, 'role length must be max 10')
      .matches(/[admin | user | manager | doctor | staff | patient]{4, 10}/),
  ),
  password: yup
    .string()
    .required('password required')
    .min(10, 'password length must be min 10')
    .max(100, 'password length must be max 100'),
  dob: yup.date(),
};

export default userValidationSchema;
