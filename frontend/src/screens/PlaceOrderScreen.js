import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { createOrder } from '../actions/orderActions';
import { roundDecimals, formatPrice } from '../utils';

const PlaceOrderScreen = ({ history }) => {
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const { shippingAddress, paymentMethod, cartItems } = cart;

	cart.itemsPrice = roundDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));

	cart.shippingPrice = roundDecimals(cart.itemsPrice > 100 ? 10 : 20);

	cart.taxPrice = roundDecimals(0.15 * cart.itemsPrice);

	cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

	const orderCreate = useSelector((state) => state.orderCreate);
	const { order, success, error } = orderCreate;

	const placeOrderHandler = () => {
		dispatch(
			createOrder({
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				itemsPrice: cart.itemsPrice,
				shippingPrice: cart.shippingPrice,
				taxPrice: cart.taxPrice,
				totalPrice: cart.totalPrice
			})
		);
	};

	useEffect(() => {
		if (success) history.push(`/order/${order._id}`);
	}, [history, success, order]);

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h5>Shipping</h5>
							<p className='lead'>
								Address: {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.postalCode} {shippingAddress.country}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h5>Payment Method</h5>
							<p className='lead'>Method: {paymentMethod}</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h5>Order Items</h5>
							{cartItems.length === 0 ? (
								<Message>
									<span className='mr-2'>Your cart is empty</span>
								</Message>
							) : (
								<ListGroup variant='flush'>
									{cartItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={2}>
													<Image src={item.image} alt={item.name} fluid rounded />
												</Col>
												<Col md={5}>
													<Link to={`/product/${item.product}`}>{item.name}</Link>
												</Col>
												<Col md={5}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h5>Order Summary</h5>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col className='font-weight-bold'>Items</Col>
									<Col className='text-right'>${formatPrice(cart.itemsPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col className='font-weight-bold'>Shiping</Col>
									<Col className='text-right'>${formatPrice(cart.shippingPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col className='font-weight-bold'>Tax</Col>
									<Col className='text-right'>${formatPrice(cart.taxPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col className='font-weight-bold'>Total</Col>
									<Col className='text-right'>${formatPrice(cart.totalPrice)}</Col>
								</Row>
							</ListGroup.Item>
							{error && (
								<ListGroup.Item>
									<Message variant='danger'>{error}</Message>
								</ListGroup.Item>
							)}
							<ListGroup.Item>
								<Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={placeOrderHandler}>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
