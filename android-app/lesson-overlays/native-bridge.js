// Trusted local lesson documents; Android checks the origin, frame and known AR source.
document.addEventListener('click',event=>{
 const link=event.target.closest?.('#arBtn');if(!link || !window.AsaweraNative)return;
 event.preventDefault();event.stopImmediatePropagation();
 const url=new URL(link.href,location.href),source=decodeURIComponent(url.pathname).replace(/^\//,'');
 window.AsaweraNative.postMessage(JSON.stringify({type:'ar',source}));
},true);
