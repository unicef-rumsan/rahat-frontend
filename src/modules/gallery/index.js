import 'react-image-gallery/styles/css/image-gallery.css';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody } from 'reactstrap';
import ImageGallery from 'react-image-gallery';
import { useToasts } from 'react-toast-notifications';
import { TOAST } from '../../constants';
import MaskLoader from '../global/MaskLoader';
import { getPhotos } from '../../services/gallery';

const Settings = props => {
	const { addToast } = useToasts();
	const [loading, setLoading] = useState(null);
	const [images, setImages] = useState([]);

	const fetchPhotos = useCallback(async () => {
		setLoading('Fetching latest photos');
		try {
			const data = await getPhotos();
			const imgList = data.photoset.photo
				.sort((a, b) => {
					return b.dateupload - a.dateupload;
				})
				.map(d => {
					console.log(d.title);
					return {
						description: d.title?.indexOf('_') < 0 ? d.title : null,
						original: `https://live.staticflickr.com/${d.server}/${d.id}_${d.secret}_b.jpg`,
						thumbnail: `https://live.staticflickr.com/${d.server}/${d.id}_${d.secret}_m.jpg`
					};
				});
			setImages(imgList);
		} catch (e) {
			addToast('Error loading photos.', TOAST.ERROR);
		} finally {
			setLoading(null);
		}
	}, []);

	useEffect(() => {
		fetchPhotos();
	}, []);

	return (
		<>
			<MaskLoader message={loading} isOpen={loading !== null} />
			<Card>
				<CardBody style={{ minHeight: 300 }}>
					<ImageGallery
						items={images}
						lazyLoad={true}
						thumbnailPosition="right"
						showPlayButton={!loading}
						showFullscreenButton={!loading}
					/>
				</CardBody>
			</Card>
		</>
	);
};

export default Settings;
