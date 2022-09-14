import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './Map.css';

import { getBeneficiariesGeo } from '../../services/stats';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = ({ height }) => {
	const mapContainerRef = useRef(null);

	const [lng, setLng] = useState(85.7994076);
	const [lat, setLat] = useState(26.6506492);
	const [zoom, setZoom] = useState(12.5);
	const [geoJson, setGeoJson] = useState(null);

	const getBenLocations = useCallback(async () => {
		let locData = await getBeneficiariesGeo();
		const features = [];
		locData.forEach(d => {
			features.push({
				type: 'Feature',
				properties: {
					title: [d.extras?.geo_longitude, d.extras?.geo_latitude].toString(),
					description: ''
				},
				geometry: {
					coordinates: [d.extras?.geo_longitude, d.extras?.geo_latitude],
					type: 'Point'
				}
			});
		});
		setGeoJson({
			features,
			type: 'FeatureCollection'
		});
	}, []);

	useEffect(() => {
		getBenLocations();
	}, [getBenLocations]);

	// Initialize map when component mounts
	useEffect(() => {
		if (!geoJson) return;
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});

		map.on('load', function () {
			// Add an image to use as a custom marker
			map.loadImage('/pin.png', function (error, image) {
				if (error) throw error;
				map.addImage('custom-marker', image);
				// Add a GeoJSON source with multiple points
				map.addSource('points', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: geoJson.features
					},
					generateId: true // This ensures that all features have unique IDs
				});
				// Add a symbol layer
				map.addLayer({
					id: 'beneficiary-loc',
					type: 'symbol',
					source: 'points',
					layout: {
						'icon-image': 'custom-marker',
						'icon-allow-overlap': true,
						'icon-size': 0.3
						// get the title name from the source's "title" property
						// 'text-field': ['get', 'title'],
						// 'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
						// 'text-offset': [0, 0.5],
						// 'text-anchor': 'top'
					}
				});
			});
		});

		let benID = null;
		const locDisplay = document.getElementById('loc');

		map.on('mousemove', 'beneficiary-loc', event => {
			map.getCanvas().style.cursor = 'pointer';
			// Set constants equal to the current feature's location
			const benLoc = event.features[0].properties.title;
			// Check whether features exist
			if (event.features.length === 0) return;
			// Display the location in the sidebar
			locDisplay.textContent = benLoc;
			// If benId for the hovered feature is not null,
			// use removeFeatureState to reset to the default behavior
			if (benID) {
				map.removeFeatureState({
					source: 'points',
					id: benID
				});
			}
			benID = event.features[0].id;
			// When the mouse moves over the beneficiary-loc layer, update the
			// feature state for the feature under the mouse
			map.setFeatureState(
				{
					source: 'points',
					id: benID
				},
				{
					hover: true
				}
			);
		});

		map.on('mouseleave', 'beneficiary-loc', () => {
			if (benID) {
				map.setFeatureState(
					{
						source: 'points',
						id: benID
					},
					{
						hover: false
					}
				);
			}
			benID = null;
			// Remove the information from the previously hovered feature from the sidebar
			locDisplay.textContent = '-';
			// Reset the cursor style
			map.getCanvas().style.cursor = '';
		});

		// Add navigation control (the +/- zoom buttons)
		map.addControl(
			new mapboxgl.NavigationControl({
				showCompass: false
			}),
			'top-right'
		);
		return () => map.remove();
	}, [geoJson]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div className="sidebarStyle">
				{/* Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} */}
				<strong>Beneficiary Coords:</strong> <span id="loc">-</span>
			</div>
			<div className="map-container" style={{ height, width: '100%' }} ref={mapContainerRef} />
		</div>
	);
};

export default Map;
