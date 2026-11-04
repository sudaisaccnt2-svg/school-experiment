import { handle } from '../../commerce/api.mjs';
export const onRequest = ({request,env}) => handle(request,env);
