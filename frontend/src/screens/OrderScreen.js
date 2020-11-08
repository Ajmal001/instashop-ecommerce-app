import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from 'react-paypal-button-v2';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { roundDecimals, formatPrice } from '../utils';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

const PlaceOrderScreen = ({ match }) => {
	const orderId = match.params.id;
	const dispatch = useDispatch();

	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, loading, error } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	const [sdkReady, setSdkReady] = useState(false);

	if (!loading && order) {
		order.itemsPrice = roundDecimals(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));
	}

	useEffect(() => {
		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get('/api/config/paypal');
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
			script.async = true;
			script.onload = () => setSdkReady(true);
			document.body.appendChild(script);
		};

		if (!order || successPay) {
			dispatch({ type: ORDER_PAY_RESET });
			dispatch(getOrderDetails(orderId));
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [orderId, order, successPay, dispatch]);

	const successPaymentHandler = (paymentResult) => {
		console.log(paymentResult);
		dispatch(payOrder(orderId, paymentResult));
	};

	return (
		<>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : order ? (
				<>
					<h3>Order {order._id}</h3>
					<Row>
						<Col md={8}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<p className='lead'>Thanks for shopping with us!</p>
									<Message variant='success'>Your order has been successfully placed</Message>
								</ListGroup.Item>
								<ListGroup.Item>
									<h5>Shipping</h5>
									<p className='lead'>
										Name: <span>{order.user.name}</span> ({order.user.email})
									</p>
									<p className='lead'>
										Address: {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}{' '}
										{order.shippingAddress.country}
									</p>
									{order.isDelivered ? (
										<Message variant='success'>Delivered on {order.deliveredAt}</Message>
									) : (
										<Message variant='info'>Not yet delivered</Message>
									)}
								</ListGroup.Item>

								<ListGroup.Item>
									<h5>Payment Method</h5>
									<p className='lead'>Method: {order.paymentMethod}</p>
									{order.isPaid ? (
										<Message variant='success'>Paid on {order.paidAt}</Message>
									) : (
										<Message variant='danger'>Payment is pending</Message>
									)}
								</ListGroup.Item>

								<ListGroup.Item>
									<h5>Order Items</h5>
									{order.orderItems.length === 0 ? (
										<Message>
											<span className='mr-2'>Your cart is empty</span>
										</Message>
									) : (
										<ListGroup variant='flush'>
											{order.orderItems.map((item, index) => (
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
											<Col className='text-right'>${formatPrice(order.itemsPrice)}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col className='font-weight-bold'>Shiping</Col>
											<Col className='text-right'>${formatPrice(order.shippingPrice)}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col className='font-weight-bold'>Tax</Col>
											<Col className='text-right'>${formatPrice(order.taxPrice)}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col className='font-weight-bold'>Total</Col>
											<Col className='text-right'>${formatPrice(order.totalPrice)}</Col>
										</Row>
									</ListGroup.Item>
									{!order.isPaid && (
										<ListGroup.Item>
											{loadingPay && <Loader />}
											{!sdkReady ? (
												<Loader />
											) : (
												<PayPalButton currency='USD' amount={+order.totalPrice.toFixed(2)} onSuccess={successPaymentHandler} />
											)}
										</ListGroup.Item>
									)}
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</>
			) : null}
		</>
	);
};

export default PlaceOrderScreen;
