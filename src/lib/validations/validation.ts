// src/lib/validations/validation.ts

export const validatePhone = (phone: string) => {
  // Regex: Bắt buộc là số, độ dài từ 10-11 ký tự, bắt đầu bằng số 0
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  
  if (!phone) return "Vui lòng nhập số điện thoại.";
  if (!/^\d+$/.test(phone)) return "Số điện thoại chỉ được chứa ký tự số.";
  if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ (VN).";
  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "Vui lòng nhập mật khẩu.";
  if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
  return "";
};