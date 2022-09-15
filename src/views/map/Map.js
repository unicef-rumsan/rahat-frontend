import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardBody } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './Map.css';

import { getBeneficiariesGeo } from '../../services/stats';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = ({ height }) => {
	const history = useHistory();
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
					id: d.id,
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
					}
				});
			});
		});

		map.on('click', 'beneficiary-loc', event => {
			history.push(`/beneficiaries/${event.features[0].properties.id}`);
		});

		map.on('mousemove', 'beneficiary-loc', event => {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', 'beneficiary-loc', () => {
			map.getCanvas().style.cursor = '';
		});

		// Add navigation control (the +/- zoom buttons)
		// map.addControl(
		// 	new mapboxgl.NavigationControl({
		// 		showCompass: false
		// 	}),
		// 	'top-right'
		// );
		return () => map.remove();
	}, [geoJson]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<Card>
				<CardBody>
					<div className="map-container" style={{ height, width: '100%' }} ref={mapContainerRef} />
				</CardBody>
			</Card>
		</div>
	);
};

export default Map;
