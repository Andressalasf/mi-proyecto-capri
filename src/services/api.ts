// src/lib/api.ts
import axios from "axios";



export const registerUser = async (userData: {
  code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post("http://localhost:4000/api/register", userData);
  return response.data;
};
