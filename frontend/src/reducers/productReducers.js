import {
	PRODUCT_LIST_REQUEST,
	PROCUST_LIST_SUCCESS,
	PRODUCT_LIST_FAILURE,
	PRODUCT_DETAILS_REQUEST,
	PROCUST_DETAILS_SUCCESS,
	PRODUCT_DETAILS_FAILURE
} from '../constants/productConstants';

export const productListReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case PRODUCT_LIST_REQUEST:
			return { loading: true, products: [] };
		case PROCUST_LIST_SUCCESS:
			return { loading: false, products: action.payload };
		case PRODUCT_LIST_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};

export const productDetailsReducer = (state = { product: {} }, action) => {
	switch (action.type) {
		case PRODUCT_DETAILS_REQUEST:
			return { loading: true, product: {} };
		case PROCUST_DETAILS_SUCCESS:
			return { loading: false, product: action.payload };
		case PRODUCT_DETAILS_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};
