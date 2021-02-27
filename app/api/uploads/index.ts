import {NextApiRequest, NextApiResponse} from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import {nanoid} from 'nanoid';
import {promises as fs} from 'fs';
import path from 'path';
import {UPLOAD_DIR} from 'utils/config';

const route = nextConnect<NextApiRequest, NextApiResponse>();

route.use(multer().single('file'));

route.post(async (request, response) => {
	const id = nanoid();

	await fs.writeFile(path.join(UPLOAD_DIR, id), (request as any).file.buffer);

	response.status(200).json({id});
});

export default route;

export const config = {
	api: {
		bodyParser: false // Disallow body parsing, consume as stream
	}
};
