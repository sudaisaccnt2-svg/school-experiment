import {ownerPage} from '../commerce/owner-page.mjs';
export const onRequest=({request,env})=>ownerPage(request,env);
