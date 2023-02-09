import React from 'react';
import style from './Card.module.css';

const Card = ({ children, ...rest }) => {
	return (
		<div className={style['card-wrapper']}>
			<div className={style['card']}>{children}</div>
		</div>
	);
};

export default Card;
