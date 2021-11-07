/*=== d2r_start __header === */

/*=== d2r_end __header ===*/

/** Session */
export interface Session {
	/** The session key */
	key?: string;
	/** The domain name */
	domain?: string;
	/** Session data */
	data?: any;
	/** Last update datetime */
	updated?: Date;
	/** Creation date time */
	created?: Date;
}

export const SessionKeys = {
	'key': { type: 'string', priv: false },
	'domain': { type: 'string', priv: false },
	'data': { type: 'any', priv: false },
	'updated': { type: 'Date', priv: false },
	'created': { type: 'Date', priv: false },
};

/** SessionData */
export interface SessionData {
	/** The session id */
	id?: string;
	/** The domain name */
	domain?: string;
	/** The JWT access token */
	access_token?: string;
	/** The token type (defaults to Bearer) */
	token_type?: string;
	/** The user name */
	name?: string;
	/** The user lastname */
	lastname?: string;
}

export const SessionDataKeys = {
	'id': { type: 'string', priv: false },
	'domain': { type: 'string', priv: true },
	'access_token': { type: 'string', priv: false },
	'token_type': { type: 'string', priv: false },
	'name': { type: 'string', priv: false },
	'lastname': { type: 'string', priv: false },
};

