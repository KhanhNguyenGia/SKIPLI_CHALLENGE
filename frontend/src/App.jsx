import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage.hooks';
import FormContainer from './containers/FormContainer/FormContainer';
import GithubContainer from './containers/GithubContainer/GithubContainer';

function App() {
	const { item: phoneNumber } = useLocalStorage('phoneNumber');

	return (
		<Routes>
			<Route path='/'>
				<Route index element={phoneNumber ? <Navigate to='/github' /> : <FormContainer />} />
				<Route path='/github' element={<GithubContainer />} />
			</Route>
		</Routes>
	);
}

export default App;
