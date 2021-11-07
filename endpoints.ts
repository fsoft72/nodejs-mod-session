
import { ILRequest, ILResponse, ILApplication, ILiweConfig, ILError, ILiWE } from '../../liwe/types';
import { send_error, send_ok, typed_dict } from "../../liwe/utils";

import { perms } from '../../liwe/auth';

import {
	get_session_admin_list, delete_session_admin_del, get_session_me, session_create, session_get, session_del, session_remove_all, session_id, session_set_val, session_db_init
} from './methods';

import {
	Session, SessionData
} from './types';

/*=== d2r_start __header ===*/

/*=== d2r_end __header ===*/

/* === SESSION API === */
export const init = ( liwe: ILiWE ) => {
	const app = liwe.app;

	console.log( "    - Session " );

	session_db_init ( liwe );


	app.get ( "/api/session/admin/list", perms( [ "session.manage" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { domain, ___errors } = typed_dict( req.query as any, [
			{ name: "domain", type: "string", required: false }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Missing required fields: ${___errors.join ( ', ' )}` } );

		get_session_admin_list ( req,domain,  ( err: ILError, sessions: Session[] ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { sessions } );
		} );
	} );

	app.delete ( "/api/session/admin/del", perms( [ "session.manage" ] ), ( req: ILRequest, res: ILResponse ) => {
		const { key, ___errors } = typed_dict( req.body, [
			{ name: "key", type: "string", required: true }
		] );

		if ( ___errors.length ) return send_error ( res, { message: `Missing required fields: ${___errors.join ( ', ' )}` } );

		delete_session_admin_del ( req,key,  ( err: ILError, ok: boolean ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { ok } );
		} );
	} );

	app.get ( "/api/session/me", ( req: ILRequest, res: ILResponse ) => {
		
		
		get_session_me ( req, ( err: ILError, session: Session ) => {
			if ( err ) return send_error( res, err );

			send_ok( res, { session } );
		} );
	} );

}
