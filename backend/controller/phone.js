const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp, cert } = require('firebase-admin/app');
const serviceAccount = require('../serviceAccount.json');
const { PHONE_REGEX, COUNTRY_CODE_REGEX, ACCESS_CODE_REGEX } = require('../constants/constant');

const firebase = initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

async function createNewAccessCode(req, res) {
	const { phoneNumber, countryCode } = req.body;
	if (!phoneNumber || !countryCode)
		return res.status(400).send({ message: 'Missing phone number and/or country code' });
	if (!PHONE_REGEX.test(phoneNumber))
		return res.status(400).send({ message: 'Invalid phone number' });
	if (!COUNTRY_CODE_REGEX.test(countryCode))
		return res.status(400).send({ message: 'Invalid country code' });
	const phone = countryCode + phoneNumber;
	try {
		const docRef = await db.collection('users').doc(phone).get();
		if (docRef.exists) return res.status(400).send({ message: 'Phone number has already existed' });
		const code = Math.random().toString().slice(2, 8); // generate a random 6-digit code, does not have to be unique.
		await client.messages.create({
			body: `Your 6-digit access code: ${code}`,
			messagingServiceSid: 'MG1613f2b60e32c0a50a4048e6730a1abb',
			to: phone,
		});
		await db.collection('users').doc(phone).create({
			phone,
			code,
			validated: false,
		});
		return res.status(200).send({ message: `We have sent a code to the number ${phone}` });
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
}

async function validateAccessCode(req, res) {
	const { accessCode, phoneNumber, countryCode } = req.body;
	if (!phoneNumber || !countryCode)
		return res.status(400).send({ message: 'Missing phone number and/or country code' });
	if (!PHONE_REGEX.test(phoneNumber))
		return res.status(400).send({ message: 'Invalid phone number' });
	if (!COUNTRY_CODE_REGEX.test(countryCode))
		return res.status(400).send({ message: 'Invalid country code' });
	if (!ACCESS_CODE_REGEX.test(accessCode))
		return res.status(400).send({ message: 'Invalid access code' });
	const phone = countryCode + phoneNumber;
	try {
		const docRef = await db.collection('users').doc(phone).get();
		if (!docRef.exists) return res.status(400).send({ message: 'Phone number does not exist' });
		const { code, validated } = docRef.data();
		if (validated)
			return res.status(400).send({ message: 'Phone number has already been validated' });
		if (accessCode !== code) return res.status(400).send({ message: 'Incorrect access code' });
		await db.collection('users').doc(phone).update({
			validated: true,
			code: '',
		});
		return res.status(200).send({ message: 'Phone number has been validated', phone });
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
}

module.exports = {
	createNewAccessCode,
	validateAccessCode,
};
