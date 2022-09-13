import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './Map.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = () => {
	const mapContainerRef = useRef(null);

	const [lng, setLng] = useState(85.30014);
	const [lat, setLat] = useState(27.700769);
	const [zoom, setZoom] = useState(12);

	// Initialize map when component mounts
	useEffect(() => {
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});

		// Add navigation control (the +/- zoom buttons)
		map.addControl(
			new mapboxgl.NavigationControl({
				showZoom: false,
				showCompass: false
			}),
			'top-right'
		);

		map.on('move', () => {
			setLng(map.getCenter().lng.toFixed(4));
			setLat(map.getCenter().lat.toFixed(4));
			setZoom(map.getZoom().toFixed(2));
		});

		// Clean up on unmount
		return () => map.remove();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div style={{ height: '400px' }}>
			<div className="sidebarStyle">
				<div>
					Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
				</div>
			</div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

export default Map;
