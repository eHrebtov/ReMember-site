import dbConnect from '../../../middleware/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
	const {
		query: { username, notes },
		method,
	} = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			// try {
			// 	await User.findOne(
			// 		{
			// 			name: username,
			// 		},
			// 		['notes'],
			// 		(err, result) => {
			// 			if (err) {
			// 				res.send(err);
			// 			} else if (result) {
			// 				result = checkAndRes(result);
			// 				res.send(result);
			// 			} else {
			// 				res.send('User not found!');
			// 			}
			// 		}
			// 	); /* find user notes */
			// } catch (err) {
			// 	res.send(err);
			// }
			try {
				const userNotes = await User.findOne(
					{
						name: username,
					},
					['notes'],
					(err, result) => {
						if (err) {
							res.status(400).json({ success: false, error: err });
						} else if (result) {
							res.status(200).json({ success: true, data: result });
						} else {
							res.status(400).json({ success: false });
						}
					}
				);
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case 'PUT':
			try {
				await User.updateOne({ name: username }, { notes: notes }, err => {
					if (err) {
						res.status(400).json({ success: false, error: err });
					} else {
						res.status(200).json({ success: true });
					}
				}); /* Update notes */
			} catch (err) {
				res.status(400).json({ success: false, error: err });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}

function checkAndRes(result) {
	if (result.notes === null || result.notes.length === 0) {
		result.notes = JSON.stringify({
			title: 'Your first note',
			content: 'Your first anser',
		});
		return result;
	} else {
		return result;
	}
}