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
					title: '',
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

		// Add navigation control (the +/- zoom buttons)
		//map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		// map.on('move', () => {
		// 	setLng(map.getCenter().lng.toFixed(4));
		// 	setLat(map.getCenter().lat.toFixed(4));
		// 	setZoom(map.getZoom().toFixed(2));
		// });

		map.on('load', function () {
			// Add an image to use as a custom marker
			map.loadImage('/pin.png', function (error, image) {
				if (error) throw error;
				map.addImage('custom-marker', image);
				// Add a GeoJSON source with multiple points
				map.addSource('points', {
					type: 'geojson',
					data: geoJson
				});
				// Add a symbol layer
				map.addLayer({
					id: 'markers',
					type: 'symbol',
					source: 'points',
					layout: {
						'icon-image': 'custom-marker',
						'icon-allow-overlap': true,
						'icon-size': 0.3
					}
				});
			});

			// map.on('click', 'markers', e => {
			// 	// Copy coordinates array.
			// 	const coordinates = e.features[0].geometry.coordinates.slice();
			// 	const description = e.features[0].properties.description;

			// 	while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			// 		coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			// 	}

			// 	new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);
			// });

			map.on('mouseenter', 'markers', () => {
				map.getCanvas().style.cursor = 'pointer';
			});

			// Change it back to a pointer when it leaves.
			map.on('mouseleave', 'markers', () => {
				map.getCanvas().style.cursor = '';
			});
		});

		// Clean up on unmount
		return () => map.remove();
	}, [geoJson]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div className="map-container" style={{ height, width: '100%' }} ref={mapContainerRef} />
		</div>
	);
};

export default Map;
