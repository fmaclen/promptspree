export interface Article {
	updated: string;
	author: string;
	headline: string;
	summary: string;
	body: string[];
	id?: string;
	prompt?: string;
	imageURL?: string;
	isPlaceholder?: boolean;
}

export const PLACEHOLDER_ARTICLE: Article = {
	updated: new Date().toISOString(),
	author: 'Poncio',
	headline: 'Flibbertigibbet Jibber-jabber Jiggery-pokery',
	summary:
		'This article delves into the world of flibbertigibbet jibber-jabber jiggery-pokery, a fascinating and little-known phenomenon that has recently been gaining attention in the scientific community.',
	body: [
		'The first thing to know about flibbertigibbet jibber-jabber jiggery-pokery is that it is a complex and multi-faceted phenomenon. At its core, it is a form of communication that is characterized by its nonsensical and seemingly random nature.',
		'Despite its apparent lack of meaning, however, flibbertigibbet jibber-jabber jiggery-pokery has been found to be a powerful tool for expressing deep emotions and ideas.'
	],
	id: undefined,
	prompt: undefined,
	imageURL: undefined,
	isPlaceholder: true
};
