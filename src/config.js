import dotenv from 'dotenv';
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//keys
const UN = process.env.QSysUN;
const Pin = process.env.QSysPin;

export {
  UN,
  Pin
}
