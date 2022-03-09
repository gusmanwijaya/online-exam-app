import { GET_TOKEN_UJIAN } from "../types";

const initialState = {
  dataTokenUjian: {},
};

const tokenUjian = (state = initialState, action) => {
  switch (action.type) {
    case GET_TOKEN_UJIAN:
      return {
        ...state,
        dataTokenUjian: action.payload,
      };
    default:
      return state;
  }
};

export default tokenUjian;
