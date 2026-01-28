// Định nghĩa Regex chuẩn dùng chung
// Chấp nhận: 09xx... hoặc 849xx... hoặc +849xx...
const PHONE_REGEX = /^(0|\+?84)(3|5|7|8|9)[0-9]{8}$/;
const CCCD_REGEX = /^[0-9]{12}$/;

/**
 * Kiểm tra định dạng số điện thoại
 * Chỉ cần đúng format là OK, không cần OTP
 */
export const validatePhone = (phone: string) => {
  if (!phone) return "Vui lòng nhập số điện thoại.";
  
  // Xóa khoảng trắng thừa
  const cleanPhone = phone.trim();

  // Kiểm tra ký tự số
  if (!/^\+?[0-9]+$/.test(cleanPhone)) {
      return "Số điện thoại chỉ được chứa số.";
  }

  // Kiểm tra độ dài và đầu số (Regex)
  if (!PHONE_REGEX.test(cleanPhone)) {
    return "Số điện thoại không hợp lệ (VD: 0912345678).";
  }

  return ""; // Trả về chuỗi rỗng nghĩa là Hợp lệ
};

/**
 * Kiểm tra định dạng CCCD
 */
export const validateCCCD = (cccd: string) => {
  if (!cccd) return "Vui lòng nhập CCCD.";
  
  const cleanCCCD = cccd.trim();

  if (!CCCD_REGEX.test(cleanCCCD)) {
    return "CCCD phải bao gồm đúng 12 chữ số.";
  }
  return "";
};

