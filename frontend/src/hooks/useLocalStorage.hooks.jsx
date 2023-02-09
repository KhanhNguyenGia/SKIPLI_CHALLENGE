import { useEffect, useState } from 'react';

const useLocalStorage = (key) => {
	const [item, setItem] = useState(localStorage.getItem(key));

	useEffect(() => {
		const getItem = (e) => {
			const item = localStorage.getItem(key);
			setItem(item);
		};
		window.addEventListener('storage', getItem);
		return () => {
			window.removeEventListener('storage', getItem);
		};
		// changes to the "key" does not require a re-run of the effect
		// eslint-disable-next-line
	}, []);

	return { item };
};

export default useLocalStorage;
