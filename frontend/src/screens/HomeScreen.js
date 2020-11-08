import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
	const dispatch = useDispatch();
	const productList = useSelector((state) => state.productList);
	const { loading = false, products = [], error = '' } = productList;

	useEffect(() => {
		dispatch(listProducts());
	}, [dispatch]);

	return (
		<>
			<h3>Latest Products</h3>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Row>
					{products.length > 0 &&
						products.map((product) => {
							return (
								<Col sm={12} md={6} lg={4} xl={3} key={product._id}>
									<Product product={product} />
								</Col>
							);
						})}
				</Row>
			)}
		</>
	);
};

export default HomeScreen;
