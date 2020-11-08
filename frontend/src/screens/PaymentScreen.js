import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ history }) => {
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const { shippingAddress } = cart;

	if (!shippingAddress.address) history.push('/shipping');

	const [paymentMethod, setPaymentMethod] = useState('PayPal');

	const submitHandler = (event) => {
		event.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		history.push('/placeorder');
	};

	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
			<h3>Payment Method</h3>
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='paymentMethod'>
					<Form.Label as='legend'>Select Method</Form.Label>
					<Form.Check
						type='radio'
						id='PayPal'
						label='PayPal or Credit Card'
						name='paymentMethod'
						value='PayPal'
						onChange={(event) => setPaymentMethod(event.target.value)}
						checked
					></Form.Check>
				</Form.Group>

				<Button type='submit' variant='primary' className='my-3'>
					Continue
				</Button>
			</Form>
		</FormContainer>
	);
};

export default PaymentScreen;
