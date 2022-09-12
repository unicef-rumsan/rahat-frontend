import axios from 'axios';

const flickrApiKey = process.env.REACT_APP_FLICKR_APIKEY;
const photoSetId = process.env.REACT_APP_FLICKR_PHOTOSET;
const flickrUrl = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${flickrApiKey}&photoset_id=${photoSetId}&extras=date_taken%2Cdate_upload&format=json&nojsoncallback=1`;

export async function getPhotos(params) {
	const { data } = await axios({
		url: flickrUrl,
		method: 'get',
		params
	});
	return data;
}
