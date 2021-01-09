import { Gender } from "../../common/Gender"

export default class Register {
  firstname: string;
  lastname: string;
  gender: Gender;
  dateOfBirth: Date;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}
