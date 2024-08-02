import React from 'react';
import { Container, Button, Row, Col, Card, Carousel } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MainLayout.css';
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div>
      <Carousel className="custom-background">
        <Carousel.Item style={{ backgroundImage: 'url(/path/to/your/image1.jpg)' }}>
          <div className="carousel-caption">
            <Container>
              <h1>Welcome to Naira Mint Note</h1>
              <p>Mint your own currency with ease and security.</p>
              <Button variant="primary">
                <Nav.Link as={Link} to="/register">Book now</Nav.Link>
              </Button>
            </Container>
          </div>
        </Carousel.Item>
        <Carousel.Item style={{ backgroundImage: 'url(../images/naira1.webp)' }}>
          <div className="carousel-caption">
            <Container>
              <h1>Secure Transactions</h1>
              <p>Enjoy fast and secure transactions with us.</p>
              <Button variant="primary">
                <Nav.Link as={Link} to="/register">Get Started</Nav.Link>
              </Button>
            </Container>
          </div>
        </Carousel.Item>
        <Carousel.Item style={{ backgroundImage: 'url(../images//naira1.webp)' }}>
          <div className="carousel-caption">
            <Container>
              <h1>Customer Satisfaction</h1>
              <p>We guarantee satisfaction with our services.</p>
              <Button variant="primary">
                <Nav.Link as={Link} to="/register">Join Now</Nav.Link>
              </Button>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      <Container className="mt-5">
        <h2 className="text-center">Features</h2>
        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Customer Satisfaction Guaranteed</Card.Title>
                <Card.Text>
                  Book Naira mint Today against the event.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Secure</Card.Title>
                <Card.Text>
                  Celebrate Your Special Occasions with Custom Naira Notes. Make every birthday, anniversary, and special event unforgettable with Naira notes from OurMint.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Fast Transactions</Card.Title>
                <Card.Text>
                  Enjoy fast and efficient transactions with our platform.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container className="mt-5">
        <h2 className="text-center">What our customers say</h2>
        <Carousel>
          <Carousel.Item>
            <div className="text-center">
              <h4>"This company is the best. I am so happy with the result!"<br /><span style={{ fontStyle: 'normal' }}>Michael Roe, Vice President, Comment Box</span></h4>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <h4>"One word... WOW!!"<br /><span style={{ fontStyle: 'normal' }}>John Doe, Salesman, Rep Inc</span></h4>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="text-center">
              <h4>"Could I... BE any more happy with this company?"<br /><span style={{ fontStyle: 'normal' }}>Chandler Bing, Actor, FriendsAlot</span></h4>
            </div>
          </Carousel.Item>
        </Carousel>
      </Container>
    </div>
  );
};

export default LandingPage;
