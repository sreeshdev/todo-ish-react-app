import { bucketConstants } from "../_constants";
// import { store } from "../store";
export const bucketListActions = {
  bucketListAdd,
  todoListAdd,
  modal,
  deleteTodo,
};

function bucketListAdd(payload) {
  return { type: bucketConstants.ADD_LIST, payload };
}
function todoListAdd(payload) {
  return { type: bucketConstants.ADD_TODO_LIST, payload };
}
function modal(payload) {
  return { type: bucketConstants.OPEN_MODAL, payload };
}
function deleteTodo(payload) {
  return { type: bucketConstants.DELETE_TODO, payload };
}
