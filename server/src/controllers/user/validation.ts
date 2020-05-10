import * as yup from 'yup';

class UserDataValidation {
  private name = yup.object().shape({
    first: yup.string().required('first name required').max(50, 'first name length must be max 50').min(1, 'first name length must be max 1'),
    last: yup.string().required('last name required').max(50, 'last name length must be max 50').min(1, 'last name length must be min 1'),
    middle: yup.string().max(50, 'middle name length must be max 50').min(1, 'middle name length must be min 1'),
  });
  private emails = yup.array().of(yup.string().required('email is required').email('email is not valid').min(4, 'email length must be min 4'));
  private phones = yup.array().of(yup.string().min(10, 'phone no length must be min 10').max(13, 'phone no length must be max 13'));
  private gender = yup
    .string()
    .length(1, 'gender length must be 1')
    .matches(/[f|m]{1}/, 'gender value');
  private martialStatus = yup
    .string()
    .length(1, 'martialStatus length must be 1')
    .matches(/[s|m]{1}/, 'martialStatus not valid');
  private panid = yup
    .string()
    .length(10, 'panid length must be 10')
    .matches(/[A-Za-z]{3}[p|P]{1}[A-Za-z]{1}\d{4}[A-Za-z]{1}/g, 'panid not valid');
  private aadharNo = yup
    .string()
    .length(12, 'aadhar No length must be 12')
    .matches(/\d{12}/, 'addhar no not valid');
  private dob = yup.date();
  private role = yup.array().of(
    yup
      .string()
      .max(4, 'role length must be min 10')
      .max(10, 'role length must be max 10')
      .matches(/[admin | user | manager | doctor | staff | patient]{4, 10}/),
  );
  private password = yup.string().required('password required').min(10, 'password length must be min 10').max(100, 'password length must be max 100');
  public validateGender = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.gender.isValid(data);
    return this.gender.validate(data);
  };
  public validateEmails = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.emails.isValid(data);
    return this.emails.validate(data);
  };
  public validatePhones = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.phones.isValid(data);
    return this.phones.validate(data);
  };
  public validateMartialStatus = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.martialStatus.isValid(data);
    return this.martialStatus.validate(data);
  };
  public validatePanid = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.panid.isValid(data);
    return this.panid.validate(data);
  };
  public validateAadharNo = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.aadharNo.isValid(data);
    return this.aadharNo.validate(data);
  };
  public validateDob = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.dob.isValid(data);
    return this.dob.validate(data);
  };
  public validateRole = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.role.isValid(data);
    return this.role.validate(data);
  };
  public validateName = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    return this.name.isValid(data);
    return this.name.validate(data);
  };
  public validatePassword = (data: any, isValid?: boolean): Promise<boolean | any | yup.ValidationError> => {
    if (isValid) return this.password.isValid(data);
    return this.password.validate(data);
  };
}

export default UserDataValidation;
