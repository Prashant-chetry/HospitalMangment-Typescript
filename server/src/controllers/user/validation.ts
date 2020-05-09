import * as yup from 'yup';

class UserDataValidation {
  private name = yup.object().shape({
    first: yup.string().required().max(50).min(1),
    last: yup.string().required().max(50).min(1),
    middle: yup.string().max(50).min(1),
  });
  private emails = yup.array().of(
    yup.object().shape({
      verified: yup.boolean(),
      address: yup.string().required().email().min(4),
    }),
  );
  private phones = yup.array().of(
    yup.object().shape({
      verified: yup.boolean(),
      number: yup.string().min(10).max(13),
    }),
  );
  private gender = yup
    .string()
    .max(1)
    .matches(/[f|m]{1}/);
  private martialStatus = yup
    .string()
    .length(1)
    .matches(/[s|m]{1}/);
  private panid = yup
    .string()
    .length(10)
    .matches(/[A-Za-z]{3}[p|P]{1}[A-Za-z]{1}\d{4}[A-Za-z]{1}/g);
  private aadharNo = yup
    .string()
    .length(12)
    .matches(/\d{12}/);
  private dob = yup.date();
  private role = yup.array().of(yup.string().matches(/[admin | user | manager | doctor | staff | patient]{4, 10}/));
  private password = yup.string().required().min(10).max(100);
  public validateGender = (data: any): Promise<boolean> => {
    return this.gender.isValid(data);
  };
  public validateEmails = (data: any): Promise<boolean> => {
    return this.emails.isValid(data);
  };
  private validatePhones = (data: any): Promise<boolean> => {
    return this.phones.isValid(data);
  };
  private validateMartialStatus = (data: any): Promise<boolean> => {
    return this.martialStatus.isValid(data);
  };
  private validatePanid = (data: any): Promise<boolean> => {
    return this.panid.isValid(data);
  };
  private validateAadharNo = (data: any): Promise<boolean> => {
    return this.aadharNo.isValid(data);
  };
  private validateDob = (data: any): Promise<boolean> => {
    return this.dob.isValid(data);
  };
  private validateRole = (data: any): Promise<boolean> => {
    return this.role.isValid(data);
  };
  private validateName = (data: any): Promise<boolean> => {
    return this.name.isValid(data);
  };
  private validatePassword = (data: any): Promise<boolean> => {
    return this.password.isValid(data);
  };
}

export default UserDataValidation;
