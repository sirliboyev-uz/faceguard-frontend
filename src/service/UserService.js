import axios from "axios";
// import { redirect } from "react-router-dom";

class UserService{
    static BASE_URL = "http://localhost:8080/api/v1"

    static async login(username, password) {
        const response = await axios.post(`${UserService.BASE_URL}/auth/login`,{ username, password });
        localStorage.setItem('firstName', response.data.firstName);
        localStorage.setItem('email', response.data.email); // Foydalanuvchi ma'lumotlarini saqlash
        return response.data;
    }
    
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('email')
        localStorage.removeItem('firstName')

    }

    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === 'Admin'
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role === 'User'
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }

}

export default UserService;