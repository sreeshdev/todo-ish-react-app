import { bucketConstants } from "../_constants";

export default function bucketList(
  state = {
    bucket: null,
    bucketCount: null,
    todos: null,
    openModal: { status: false, modal: null, data: null, edit: false },
  },
  action
) {
  switch (action.type) {
    case bucketConstants.ADD_LIST:
      return {
        ...state,
        bucket: action.payload.bucket,
        bucketCount: action.payload.bucketCount,
        openModal: { ...state.openModal, ...action.payload.openModal },
      };
    case bucketConstants.ADD_TODO_LIST:
      return {
        ...state,
        todos: action.payload.todo,
      };
    case bucketConstants.OPEN_MODAL:
      return {
        ...state,
        openModal: { ...state.openModal, ...action.payload },
      };
  
    default:
      return state;
  }
}
