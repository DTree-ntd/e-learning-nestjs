/**
 * User Response Status
 */

export const UserError = {
  200: {
    code: 200,
    message: 'get all user investigate data successfully',
  },
  202: {
    code: 202,
    message: 'Invalid customer active status',
  },
  204: {
    code: 204,
    message: 'Customer not found',
  },
  301: {
    code: 301,
    message: 'OK',
  },
  302: {
    code: 302,
    message: 'OK',
  },
  400: {
    code: 400,
    message: 'Tài khoản chưa được đăng ký',
  },
  401: {
    code: 401,
    message: 'Invalid token',
  },
  402: {
    code: 402,
    message: 'Tài khoản chưa đăng ký',
  },
  403: {
    code: 403,
    message: 'You might not have permission',
  },
  404: {
    code: 404,
    message: 'Mật khẩu chưa đúng',
  },
  405: {
    code: 405,
    message: 'Email đã tồn tại trong hệ thống.',
  },
  406: {
    code: 406,
    message: 'Số điện thoại đã tồn tại trong hệ thống.',
  },
  407: {
    code: 407,
    message: 'Verification code is incorrect',
  },
  408: {
    code: 408,
    message: 'email exists',
  },
  409: {
    code: 409,
    message: 'email or phone exists',
  },
  411: {
    code: 411,
    message:
      'Bạn đã nhập sai 5 lần. Sau 30 phút nữa mới có thể yêu cầu 1 mã OTP mới',
  },
  412: {
    code: 412,
    message:
      'Bạn đã nhập sai quá 5 lần. Sau {{time}}h nữa mới có thể yêu cầu 1 mã OTP mới',
  },
  413: {
    code: 413,
    message: 'Bạn đã nhập sai mã OTP, hãy thử lại',
  },
  414: {
    code: 414,
    message: 'OTP đã hết hạn, hãy yêu cầu mã OTP mới',
  },
  415: {
    code: 415,
    message: 'Vui lòng đợi 30 giây',
  },
  416: {
    code: 416,
    message: 'Hãy chọn 1 ảnh khác.',
  },
  417: {
    code: 417,
    message: 'Tài khoản chưa được kích hoạt',
  },
  418: {
    code: 418,
    message: 'Mật khẩu hiện tại chưa đúng',
  },
  419: {
    code: 419,
    message: 'Mật khẩu mới trùng với mật khẩu đang sử dụng',
  },
  420: {
    code: 420,
    message: 'Tài khoản của quý khách đã bị khóa',
  },
  201: {
    code: 201,
    message: 'Role do not exist!',
  },
  421: {
    code: 421,
    message: 'Đường link đã hết hạn hoặc không tồn tại',
  },
  422: {
    code: 422,
    message: 'Thay đổi mật khẩu không thành công',
  },
  423: {
    code: 423,
    message: 'Bạn cần thay đổi mật khẩu',
  },
};
