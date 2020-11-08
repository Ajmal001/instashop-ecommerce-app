import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD } from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [], shippingAddress: {}, paymentMethod: '' }, action) => {
	switch (action.type) {
		case CART_ADD_ITEM: {
			const itemToAdd = action.payload;
			const existingItem = state.cartItems.find((item) => item.product === itemToAdd.product);
			if (existingItem) {
				return { ...state, cartItems: state.cartItems.map((item) => (item.product === existingItem.product ? itemToAdd : item)) };
			} else {
				return { ...state, cartItems: [...state.cartItems, itemToAdd] };
			}
		}

		case CART_REMOVE_ITEM: {
			return { ...state, cartItems: state.cartItems.filter((item) => item.product !== action.payload) };
		}

		case CART_SAVE_SHIPPING_ADDRESS: {
			return { ...state, shippingAddress: action.payload };
		}

		case CART_SAVE_PAYMENT_METHOD: {
			return { ...state, paymentMethod: action.payload };
		}

		default:
			return state;
	}
};
