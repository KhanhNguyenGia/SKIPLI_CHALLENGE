import React, { forwardRef } from 'react';
import style from './Select.module.css';
import Input from '../Input/Input.component';

const Select = forwardRef(({ values, ...rest }, ref) => {
	const onChange = (e) => {
		ref.current = e.target.value;
	};

	return (
		<div className={style.select}>
			<Input className={style['select-input']} list='brow' onChange={onChange} {...rest} />
			<datalist id='brow'>
				{values.map(({ value, option }) => (
					<option key={option} value={value}>
						{option}
					</option>
				))}
			</datalist>
		</div>
	);
});

export default Select;
