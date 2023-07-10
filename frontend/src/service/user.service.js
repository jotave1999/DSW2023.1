import { httpService } from './http.service'
import { socketService, SOCKET_EVENT_USER_UPDATED } from './socket.service'
const STORAGE_KEY_LOGGEDIN_USER = 'user'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    getUsers,
    reqPassRecover,
    passRecover,
}

async function login(user) {
    const loggedInUser = await httpService.post('auth/login', user)
    if (loggedInUser) {
        socketService.setup(loggedInUser);
        return _saveLocalUser(loggedInUser);
    }
}

async function signup(user) {
    const signedUser = await httpService.post('auth/signup', user)
    socketService.setup(signedUser);
    return _saveLocalUser(signedUser)
}

async function reqPassRecover(email) {
    const req = await httpService.post('user/recover/request', email)
    return req
}

async function passRecover(user) {
    const req = await httpService.post('user/recover', user)
    return req
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    const res = await httpService.post('auth/logout');
    socketService.terminate();
    return res;
}

async function getUsers() {
    const users = await httpService.get('user/');
    return users
}

function _saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

export function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}
