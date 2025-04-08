export const validateName = (name) => {
    if (!name.trim()) return "Name is required.";
    if (name.length < 3) return "Name must be at least 3 characters.";
    return null;
  };
  
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required.";
    if (!emailRegex.test(email)) return "Invalid email format.";
    return null;
  };
  
  export const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };
  
  export const validatePhoneNumber = (phonenumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phonenumber) return "Phone number is required.";
    if (!phoneRegex.test(phonenumber)) return "Invalid phone number. Must be 10 digits.";
    return null;
  };
  
  export const validateAddress = (address) => {
    if (!address.trim()) return "Address is required.";
    return null;
  };
  
  export const validateGender = (gender) => {
    if (!gender.length) return "Please select a gender.";
    return null;
  };
  