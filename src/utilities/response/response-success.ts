import { RESPONSE_SUCCESS } from '../constants/constant';

export const apiSuccess = (data: any) => {
  return {
    resultCode: RESPONSE_SUCCESS.CODE,
    errorMessage: RESPONSE_SUCCESS.ERROR_MSG,
    data: data,
  };
};
