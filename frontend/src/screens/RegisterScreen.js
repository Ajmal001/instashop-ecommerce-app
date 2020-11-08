import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';

const RegisterScreen = ({ history, location }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);

	const dispatch = useDispatch();
	const userRegister = useSelector((state) => state.userRegister);
	const { loading = false, userInfo = null, error = '' } = userRegister;

	const redirect = location.search ? location.search.split('=')[1] : '/';

	useEffect(() => {
		if (userInfo) history.push(redirect);
	}, [history, userInfo, redirect]);

	const submitHandler = (event) => {
		event.preventDefault();
		setMessage(null);
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
		} else {
			dispatch(register(name, email, password));
		}
	};

	return (
		<FormContainer>
			<h3>Sign Up</h3>
			{message ? <Message variant='danger'>{message}</Message> : error ? <Message variant='danger'>{error}</Message> : null}
			{loading ? (
				<Loader />
			) : (
				<>
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter name'
								value={name}
								onChange={(event) => setName(event.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='password'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Enter password'
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='confirmPassword'>
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Confirm password'
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
							></Form.Control>
						</Form.Group>

						<Button type='submit' variant='primary'>
							Register
						</Button>
					</Form>
					<Row className='py-3'>
						<Col>
							Already have an account?{' '}
							<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
								<span className='font-weight-bold'>Login here</span>
							</Link>
						</Col>
					</Row>
				</>
			)}
		</FormContainer>
	);
};

export default RegisterScreen;
