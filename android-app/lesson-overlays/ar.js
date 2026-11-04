export function createARLink({link,text,files,getZone,showMessage}) {
 function update(){const source=files[getZone()];link.hidden=!source;if(source){link.href=source;link.removeAttribute('rel');link.removeAttribute('download');link.title='Open this scene in native AR';}}
 link.addEventListener('click',event=>{event.preventDefault();const file=files[getZone()];if(file && window.AsaweraNative){const source=decodeURIComponent(new URL(file,location.href).pathname).replace(/^\//,'');window.AsaweraNative.postMessage(JSON.stringify({type:'ar',source}));}else showMessage('Use the AR button in the app.');});
 update();return {update};
}
