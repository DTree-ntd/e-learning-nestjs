import { RESPONSE_SUCCESS } from 'src/core/database/constant/constant';

export const apiSuccess = (data: any) => {
  return {
    resultCode: RESPONSE_SUCCESS.CODE,
    errorMessage: RESPONSE_SUCCESS.ERROR_MSG,
    data: data,
  };
};
