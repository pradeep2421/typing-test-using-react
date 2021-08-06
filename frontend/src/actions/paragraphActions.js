import {
  PARAGRAPH_DETAILS_FAIL,
  PARAGRAPH_DETAILS_REQUEST,
  PARAGRAPH_DETAILS_SUCCESS,
  PARAGRAPH_LIST_FAIL,
  PARAGRAPH_LIST_REQUEST,
  PARAGRAPH_LIST_SUCCESS,
} from "../constants/paragraphConstants";
import Axios from "axios";
export const listParagraphs = () => async (dispatch) => {
  dispatch({
    type: PARAGRAPH_LIST_REQUEST,
  });
  try {
    const { data } = await Axios.get(`/api/paragraphs`);
    dispatch({ type: PARAGRAPH_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PARAGRAPH_LIST_FAIL, payload: error.message });
  }
};

export const detailsParagraph = (paragraphId) => async (dispatch) => {
  dispatch({ type: PARAGRAPH_DETAILS_REQUEST, payload: paragraphId });
  try {
    const { data } = await Axios.get(`/api/paragraph/${paragraphId}`);
    dispatch({ type: PARAGRAPH_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PARAGRAPH_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
