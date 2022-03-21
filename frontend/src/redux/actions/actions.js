import { ADD_USER,REMOVE_USER } from "../action-types/action-types.js";
export function addUser(payload) {
  console.log("dispatching the action")
  return { type: ADD_USER, payload };
}

export function removeUser() {
  console.log("dispatching the action")
  return { type: REMOVE_USER};
}