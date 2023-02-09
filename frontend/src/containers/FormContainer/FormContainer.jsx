import React, { useRef, useState } from 'react';
import { Button, Input, Select } from '../../components';
import { COUNTRY_CODE_REGEX, ACCESS_CODE_REGEX, PHONE_REGEX } from '../../constants/regex';
import { ORIGIN, PHONE_CREATE, PHONE_VALIDATE } from '../../constants/routes';
import countryCode from '../../assets/CountryCodes.json';
import style from './FormContainer.module.css';

const FORMATTED_COUNTRY_CODE = countryCode.map(({ name, dial_code, code }) => ({
	option: `${name.length > 12 ? code : name} (${dial_code})`,
	value: dial_code,
}));

const FormContainer = () => {
	const phoneRef = useRef('');
	const codeRef = useRef('');
	const countryRef = useRef('');
	const [response, setResponse] = useState({ error: false, message: '' });
	const [loading, setLoading] = useState(false);

	const isInvalidSubmission = () =>
		response.error ||
		loading ||
		!COUNTRY_CODE_REGEX.test(countryRef.current) ||
		!PHONE_REGEX.test(phoneRef.current);

	const onPhoneChange = (e) => {
		if (PHONE_REGEX.test(e.target.value)) {
			setResponse({ error: false, message: '' });
		} else {
			setResponse({ error: true, message: 'Please enter a valid phone number' });
		}
		phoneRef.current = e.target.value;
	};

	const onCodeChange = (e) => {
		if (ACCESS_CODE_REGEX.test(e.target.value)) {
			setResponse({ error: false, message: '' });
		} else {
			setResponse({ error: true, message: 'Please enter a valid 6-digit code' });
		}
		codeRef.current = e.target.value;
	};

	const onPhoneSubmit = async () => {
		// prevent spamming
		if (isInvalidSubmission()) return;
		setLoading(true);
		try {
			const result = await fetch(`${ORIGIN}${PHONE_CREATE}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ phoneNumber: phoneRef.current, countryCode: countryRef.current }),
			});
			if (!result.ok) {
				const data = await result.json();
				const { message } = data;
				setResponse({ error: true, message });
				throw new Error(message);
			}
			const data = await result.json();
			const { message } = data;
			setResponse({ error: false, message });
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const onCodeValidate = async () => {
		// prevent spamming
		if (isInvalidSubmission() || !ACCESS_CODE_REGEX.test(codeRef.current)) return;
		setLoading(true);
		try {
			const result = await fetch(`${ORIGIN}${PHONE_VALIDATE}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					phoneNumber: phoneRef.current,
					accessCode: codeRef.current,
					countryCode: countryRef.current,
				}),
			});
			if (!result.ok) {
				const data = await result.json();
				const { message } = data;
				setResponse({ error: true, message });
				throw new Error(message);
			}
			const data = await result.json();
			const { phoneNumber, message } = data;
			setResponse({ error: false, message });
			localStorage.setItem('phoneNumber', phoneNumber);
			dispatchEvent(new Event('storage'));
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={style.wrapper}>
			<form className={style['form_container']} onSubmit={(e) => e.preventDefault()}>
				<h1 className={style['form_container-h1']}>Phone validation</h1>
				{response?.message && (
					<h4 className={response.error ? style.error : style.success}>{response.message}</h4>
				)}
				<label className={style['form_container-label']} htmlFor='phone'>
					<span>Phone</span>
					<Select disabled={loading} values={FORMATTED_COUNTRY_CODE} ref={countryRef} />
					<Input disabled={loading} id='phone' name='phone' onChange={onPhoneChange} type='phone' />
				</label>
				<label className={style['form_container-label']} htmlFor='code'>
					<span>Code</span>
					<Input
						disabled={loading}
						id='code'
						name='code'
						onChange={onCodeChange}
						minLength={6}
						maxLength={6}
					/>
				</label>
				<div className={style['form_container-div']}>
					<Button disabled={loading || response.error} type='button' onClick={onPhoneSubmit}>
						Register
					</Button>
					<Button disabled={loading || response.error} type='button' onClick={onCodeValidate}>
						Validate
					</Button>
				</div>
			</form>
		</div>
	);
};

export default FormContainer;
