// // src/services/BranchService.js
// import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/api/v1/branch';

// const getBranches = async (token) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.status === 403) {
//         throw new Error('Permission Denied'); // Custom error for 403
//       }
//       throw error; // Rethrow other errors
//     }
//   };
  
//   const updateBranch = async (id, values, token) => {
//     try {
//       const response = await axios.put(`${BASE_URL}/update/${id}`, values, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.status === 403) {
//         throw new Error('Permission Denied');
//       }
//       throw error;
//     }
//   };
  
//   export default { getBranches, updateBranch };