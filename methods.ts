
import { ILRequest, ILResponse, LCback, ILiweConfig, ILError, ILiWE } from '../../liwe/types';
import { mkid } from '../../liwe/utils';
import { DocumentCollection } from 'arangojs/collections';

import {
	Session, SessionKeys, SessionData, SessionDataKeys
} from './types';

let _liwe: ILiWE = null;

let _coll_sessions: DocumentCollection = null;

const COLL_SESSIONS = "sessions";

/*=== d2r_start __file_header === */
import { get_real_ip } from '../../liwe/defender';
import { md5 } from '../../liwe/utils';
import { adb_query_one, adb_record_add, adb_find_one, adb_find_all, adb_query_all, adb_prepare_filters, adb_collection_init } from '../../liwe/db/arango';

const _session_key = ( req: ILRequest, session_id: string ) => {
	console.log( "SESSION KEY - REAL IP: ", get_real_ip( req ), session_id );
	const _ip = req.cfg.security.session?.bind_ip ? get_real_ip( req ) : req.cfg.security.secret;

	return session_id + "-" + md5( `${ session_id }-${ _ip }` );
};
/*=== d2r_end __file_header ===*/

/**
 * List all available sessions
 *
 * @param domain - The domain, if not set the session domain will be used [opt]
 *
 */
export const get_session_admin_list = ( req: ILRequest, domain?: string, cback: LCback = null ): Promise<Session[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start get_session_admin_list ===*/
		const [ filters, values ] = adb_prepare_filters( 'session', { domain } );
		const sessions: Session[] = await adb_query_all( req.db, `FOR session IN ${ COLL_SESSIONS } ${ filters } RETURN session`, values );

		return cback ? cback( null, sessions ) : resolve( sessions );
		/*=== d2r_end get_session_admin_list ===*/
	} );
};

/**
 * Deletes a session
 *
 * @param key - The session `key` [req]
 *
 */
export const delete_session_admin_del = ( req: ILRequest, key: string, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start delete_session_admin_del ===*/

		/*=== d2r_end delete_session_admin_del ===*/
	} );
};

/**
 * Returns the current user session
 *

 *
 */
export const get_session_me = ( req: ILRequest, cback: LCback = null ): Promise<Session> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start get_session_me ===*/
		const sess: Session = await session_get( req, req.user.session_key );
		return cback ? cback( null, sess ) : resolve( sess );
		/*=== d2r_end get_session_me ===*/
	} );
};

/**
 * Creates a new session
 *
 * @param req - The ILRequest [req]
 * @param session_key - The session unique key [req]
 * @param domain - The domain name [req]
 * @param data - The initial data to be saved [req]
 *
 */
export const session_create = ( req: ILRequest, session_key: string, domain: string, data: any, cback: LCback = null ): Promise<any> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start session_create ===*/
		await session_del( req, session_key );

		await adb_record_add( req.db, COLL_SESSIONS, { key: session_key, domain, data } );

		return cback ? cback( null, true ) : resolve( true );
		/*=== d2r_end session_create ===*/
	} );
};

/**
 * Returns a user session by the given Token
 *
 * @param req - The ILRequest [req]
 * @param session_key - The session unique key [req]
 * @param full - If the session should return all info and not just data [opt]
 *
 */
export const session_get = ( req: ILRequest, session_key: string, full: boolean = false, cback: LCback = null ): Promise<any> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start session_get ===*/
		const res = await adb_query_one( req.db, "FOR u IN sessions FILTER u.key == @key RETURN u", { key: session_key } );

		if ( !res ) return cback ? cback( null, null ) : resolve( null );

		if ( full ) return cback ? cback( null, res ) : resolve( res );

		return cback ? cback( null, res.data ) : resolve( res.data );
		/*=== d2r_end session_get ===*/
	} );
};

/**
 * Deletes a session
 *
 * @param req - The ILRequest [req]
 * @param session_key - The Session key [req]
 *
 */
export const session_del = ( req: ILRequest, session_key: string, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start session_del ===*/
		const s = "FOR el IN sessions FILTER el.key == @session_key REMOVE el IN sessions";
		await _liwe.db.query( s, { session_key } );

		return cback ? cback( null, true ) : resolve( true );
		/*=== d2r_end session_del ===*/
	} );
};

/**
 * Removes all sessions by sess_id
 *
 * @param req - The ILRequest [req]
 * @param session_id - The session id [req]
 *
 */
export const session_remove_all = ( req: ILRequest, session_id: string, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start session_remove_all ===*/
		const sess: { _id: string, key: string; }[] = await adb_query_all( req.db, `FOR s IN sessions RETURN { _id: s._id, key: s.key }` );
		await Promise.all( sess.map( async ( s ) => {
			if ( s.key.indexOf( session_id ) != -1 )
				await _coll_sessions.remove( s._id );
		} ) );

		return cback ? cback( null, true ) : resolve( true );
		/*=== d2r_end session_remove_all ===*/
	} );
};

/**
 * Returns the session ID of the current user
 *
 * @param req - The ILRequest [req]
 * @param id_user - The *forced* id user [opt]
 *
 */
export const session_id = ( req: ILRequest, id_user: string = "null", cback: LCback = null ): Promise<string[]> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start session_id ===*/
		if ( !id_user ) id_user = req.user?.id;
		const _session_id = md5( id_user );

		return resolve( [ _session_key( req, _session_id ), _session_id ] );
		/*=== d2r_end session_id ===*/
	} );
};

/**
 * Sets a value in the session
 *
 * @param req - The ILRequest [req]
 * @param key - The key to set in the session [req]
 * @param val - The value to be set in the session [req]
 *
 */
export const session_set_val = ( req: ILRequest, key: string, val: string, cback: LCback = null ): Promise<any> => {
	return new Promise( async ( resolve, reject ) => {
		/*=== d2r_start session_set_val ===*/
		let sess = await session_get( req, ( req.user as any ).session_key, true );

		sess.data[ key ] = val;

		sess = await adb_record_add( req.db, COLL_SESSIONS, sess, SessionKeys );

		return cback ? cback( null, sess ) : resolve( sess );
		/*=== d2r_end session_set_val ===*/
	} );
};

/**
 * Initializes the session module
 *
 * @param liwe - LiWE full config [req]
 *
 */
export const session_db_init = ( liwe: ILiWE, cback: LCback = null ): Promise<boolean> => {
	return new Promise( async ( resolve, reject ) => {
		_liwe = liwe;

		_coll_sessions = await adb_collection_init( liwe.db, COLL_SESSIONS, [
			{ type: "persistent", fields: [ "key" ], unique: true },
			{ type: "persistent", fields: [ "domain" ], unique: false },
		] );

		/*=== d2r_start session_db_init ===*/

		/*=== d2r_end session_db_init ===*/
	} );
};
