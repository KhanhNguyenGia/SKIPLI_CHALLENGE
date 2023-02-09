import React from 'react';
import { Button, Input } from '../../components';
import { ReactComponent as SearchIcon } from '../../assets/search.svg';
import style from './SearchContainer.module.css';

const SearchContainer = ({
	onSearch,
	loading,
	perPageRef,
	onPerPageChange,
	onSearchChange,
	searchRef,
}) => {
	return (
		<form className={style.search} onSubmit={onSearch}>
			<label className={style.label} htmlFor='search'>
				<div className={style.icon}>
					<SearchIcon />
				</div>
				<Input
					name='search'
					id='search'
					onChange={onSearchChange}
					placeholder='Octopus...'
					disabled={loading}
					defaultValue={searchRef.current}
					required
				/>
			</label>
			<select
				className={style.select}
				type='number'
				defaultValue={perPageRef.current}
				disabled={loading}
				onChange={onPerPageChange}
				required
			>
				<option value={40}>40</option>
				<option value={60}>60</option>
				<option value={100}>100</option>
			</select>
			<Button type='submit' disabled={loading}>
				Search
			</Button>
		</form>
	);
};

export default SearchContainer;
