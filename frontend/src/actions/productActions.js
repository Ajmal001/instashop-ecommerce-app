import axios from 'axios';
import {
	PRODUCT_LIST_REQUEST,
	PROCUST_LIST_SUCCESS,
	PRODUCT_LIST_FAILURE,
	PRODUCT_DETAILS_REQUEST,
	PROCUST_DETAILS_SUCCESS,
	PRODUCT_DETAILS_FAILURE
} from '../constants/productConstants';

export const listProducts = () => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_LIST_REQUEST });
		const { data } = await axios.get('/api/products');
		dispatch({ type: PROCUST_LIST_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: PRODUCT_LIST_FAILURE,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message
		});
	}
};

export const getProductDetails = (productId) => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_DETAILS_REQUEST });
		const { data } = await axios.get(`/api/products/${productId}`);
		dispatch({ type: PROCUST_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAILURE,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message
		});
	}
};
