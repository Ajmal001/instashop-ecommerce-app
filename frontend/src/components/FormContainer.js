import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
	return (
		<Container>
			<Row className='justify-content-md-center py-3'>
				<Col md={6}>{children}</Col>
			</Row>
		</Container>
	);
};

export default FormContainer;
