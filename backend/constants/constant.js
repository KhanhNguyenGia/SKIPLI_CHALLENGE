const PHONE_REGEX = /^[+]?[(]?[0-9]{0,3}[)]?[-. ]?[0-9]{3}[-. ]?[0-9]{4,6}$/;
const COUNTRY_CODE_REGEX = /^[+][\d]{1,4}$/;
const ACCESS_CODE_REGEX = /^[\d]{6}$/;

module.exports = {
	PHONE_REGEX,
	COUNTRY_CODE_REGEX,
	ACCESS_CODE_REGEX,
};
