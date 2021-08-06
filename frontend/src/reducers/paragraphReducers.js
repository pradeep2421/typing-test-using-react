import {
  PARAGRAPH_DETAILS_FAIL,
  PARAGRAPH_DETAILS_REQUEST,
  PARAGRAPH_DETAILS_SUCCESS,
  PARAGRAPH_LIST_FAIL,
  PARAGRAPH_LIST_REQUEST,
  PARAGRAPH_LIST_SUCCESS,
} from "../constants/paragraphConstants";

export const paragraphListReducer = (
  state = { loading: true, paragraphs: [] },
  action
) => {
  switch (action.type) {
    case PARAGRAPH_LIST_REQUEST:
      return { loading: true };
    case PARAGRAPH_LIST_SUCCESS:
      return { loading: false, paragraphs: action.payload };
    case PARAGRAPH_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const paragraphDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PARAGRAPH_DETAILS_REQUEST:
      return { loading: true };
    case PARAGRAPH_DETAILS_SUCCESS:
      return { loading: false, paragraph: action.payload };
    case PARAGRAPH_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
