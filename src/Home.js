import React, { useState, useEffect } from 'react';
import { Navbar, Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './Home.css'; 
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';

// Set up custom marker icon
const customIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    shadowSize: [41, 41],
});

function Home() {
    // State management
    const [showModal, setShowModal] = useState(false); // Controls the visibility of the modal
    const [markers, setMarkers] = useState([]); // Stores the list of markers on the map
    const [newPlace, setNewPlace] = useState({ name: '', description: '', lat: '', lng: '' }); // Stores data for a new or edited place
    const [editingMarker, setEditingMarker] = useState(null); // Tracks the marker being edited

    const navigate = useNavigate(); // For navigation

    // Fetch markers from the backend when the component mounts
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const placesResponse = await axios.get('http://localhost:8081/api/getPlaces');
                setMarkers(placesResponse.data);
            } catch (error) {
                console.error('There was an error fetching data!', error);
            }
        };

        fetchMarkers();
    }, []);

    // Handle modal show/hide
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMarker(null); // Reset editing marker
        setNewPlace({ name: '', description: '', lat: '', lng: '' }); // Reset new place data
    };

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlace({ ...newPlace, [name]: value }); // Update state with form data
    };

    // Handle form submission for adding or editing a place
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingMarker) {
                // If editing, send a PUT request to update the place
                await axios.put(`http://localhost:8081/api/updatePlace/${editingMarker.id}`, newPlace);
                setMarkers(markers.map(marker => 
                    marker.id === editingMarker.id 
                    ? { ...marker, ...newPlace, lat: parseFloat(newPlace.lat), lng: parseFloat(newPlace.lng) } 
                    : marker
                ));
            } else {
                // If adding, send a POST request to add a new place
                const response = await axios.post('http://localhost:8081/api/addPlace', newPlace);
                setMarkers([...markers, { ...newPlace, id: response.data.id, lat: parseFloat(newPlace.lat), lng: parseFloat(newPlace.lng) }]);
            }
            handleCloseModal(); // Close modal after submission
        } catch (error) {
            console.error('There was an error processing your request!', error);
        }
    };

    // Handle marker click to edit a place
    const handleMarkerClick = (marker) => {
        setEditingMarker(marker);
        setNewPlace(marker);
        setShowModal(true); // Show modal with pre-filled data
    };

    // Handle marker deletion
    const handleDelete = async () => {
        if (editingMarker) {
            try {
                await axios.delete(`http://localhost:8081/api/deletePlace/${editingMarker.id}`);
                setMarkers(markers.filter(marker => marker.id !== editingMarker.id)); // Remove marker from the list
                handleCloseModal(); // Close modal after deletion
            } catch (error) {
                console.error('There was an error deleting the marker!', error);
            }
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn'); // Remove login state
        navigate('/'); // Redirect to login page
    };

    return (
        <div className="home-container">
            {/* Navbar with a brand/logo and logout button */}
            <Navbar className="navbar-custom" variant="dark">
                <Container className="d-flex justify-content-between align-items-center">
                    <Navbar.Brand href="#home" className="d-flex align-items-center font-weight-bold text-white">
                        <img src={logo} alt="Logo" />
                        Map Locator
                    </Navbar.Brand>
                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                </Container>
            </Navbar>

            {/* Main content area */}
            <div className="content-container">
                {/* Header with welcome message and button to add a new place */}
                <div className="header-container">
                    <h4 className="welcome-message">Welcome!</h4>
                    <Button variant="primary" className="add-place-button" onClick={handleShowModal}>
                        Add New
                    </Button>
                </div>

                {/* Map container */}
                <div className="map-container">
                    <MapContainer center={[4.2105, 101.9758]} zoom={8} style={{ width: '100%', height: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/* Render markers on the map */}
                        {markers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={[marker.lat, marker.lng]}
                                icon={customIcon}
                                eventHandlers={{ click: () => handleMarkerClick(marker) }} // Open modal on marker click
                            >
                                <Tooltip direction="top" offset={[0, -20]} opacity={1} sticky>
                                    <strong>{marker.name}</strong><br />
                                    {marker.description}
                                </Tooltip>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* Modal for adding/editing a place */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingMarker ? 'Edit Place' : 'Add New Place'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Form fields for place name, description, latitude, and longitude */}
                        <Form.Group controlId="formPlaceName">
                            <Form.Label>Place Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newPlace.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPlaceDescription">
                            <Form.Label>Place Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={newPlace.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="formPlaceLat">
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="lat"
                                        value={newPlace.lat}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formPlaceLng">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="lng"
                                        value={newPlace.lng}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Form buttons */}
                        <div className="text-center mt-4">
                            <Button variant="secondary" onClick={handleCloseModal} className="me-2">Close</Button>
                            {editingMarker && (
                                <Button variant="danger" onClick={handleDelete} className="me-2">Delete</Button>
                            )}
                            <Button variant="primary" type="submit">
                                {editingMarker ? 'Save Changes' : 'Add Place'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Home;
