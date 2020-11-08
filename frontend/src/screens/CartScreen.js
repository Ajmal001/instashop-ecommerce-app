import React, { useEffect } from 'react';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import { addToCart, removeFromcart } from '../actions/cartActions';

const CartScreen = ({ match, location, history }) => {
	const productId = match.params.id;
	const quantity = location.search ? +location.search.split('=')[1] : 1;

	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;

	useEffect(() => {
		if (productId) dispatch(addToCart(productId, quantity));
	}, [productId, quantity, dispatch]);

	const removeFromCartHandler = (id) => {
		dispatch(removeFromcart(id));
	};

	const checkoutHandler = () => {
		history.push(`/login?redirect=shipping`);
	};

	return (
		<Row>
			<Col md={8}>
				<h3>Shopping Cart</h3>
				{cartItems.length === 0 ? (
					<Message>
						<span className='mr-2'>Your cart is empty</span>
						<Link to='/'>
							<span className='font-weight-bold'>Go Back</span>
						</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
						{cartItems.map((item) => (
							<ListGroup.Item key={item.product} className='px-0'>
								<Row>
									<Col md={2}>
										<Image src={item.image} alt={item.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
									</Col>
									<Col md={2}>${item.price}</Col>
									<Col md={3}>
										<Form.Control as='select' value={item.qty} onChange={(event) => dispatch(addToCart(item.product, +event.target.value))}>
											{[...Array(item.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</Col>
									<Col md={2}>
										<Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
											<i className='fas fa-trash'></i>
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={4}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h5>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h5>$
							{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
						</ListGroup.Item>
						<ListGroup.Item>
							<Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
								Proceed to Checkout
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	);
};

export default CartScreen;
