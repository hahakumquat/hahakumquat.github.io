window.onload=function(){function e(){d=new THREE.Scene,f=new THREE.PerspectiveCamera(30,s/p,1,2*s),f.position.z=s,d.add(f),u=n(S[C]),t(new THREE.PlaneBufferGeometry(w-4,w-4)),c=new THREE.WebGLRenderer,c.setSize(s,p),document.getElementById("container").appendChild(c.domElement),document.addEventListener("mousemove",a,!1),document.body.onkeyup=function(e){if(32==e.keyCode){var n;n=B?new THREE.SphereGeometry(w/1.8,15):new THREE.PlaneBufferGeometry(w-4,w-4),t(n),B=!B}},document.addEventListener("click",function(e){i(l,S[++C%S.length]),u.needsUpdate=!0,a(e,!0)},!1),h()}function t(e){m.forEach(function(e){d.remove(e)}),m=[];for(var t=0;t<v;t++)for(var n=0;n<g;n++){mat=new THREE.ShaderMaterial({uniforms:{texture:{type:"t",value:u},rotation:{type:"f",value:0}},vertexShader:document.getElementById("vertexshader").textContent,fragmentShader:document.getElementById("fragmentshader").textContent,side:THREE.DoubleSide});var a=new THREE.Mesh(e,mat);a.position.setX((n-(g-1)/2)*w),a.position.setY(Math.floor(v/2-t)*w),a.rotation.x=Math.PI,a.row=t,a.col=n,a.ripple=-1,a.adjacents=o(t,n),d.add(a),m.push(a)}}function n(e){var t=document.createElement("canvas");t.height=256,t.width=256,l=t.getContext("2d"),i(l,e);var n=new THREE.Texture(t);return n.needsUpdate=!0,n}function o(e,t){var n=[];return e>0&&(t>0&&n.push([e-1,t-1]),t<g-1&&n.push([e-1,t+1])),e<v-1&&(t>0&&n.push([e+1,t-1]),t<g-1&&n.push([e+1,t+1])),e>0&&n.push([e-1,t]),e<v-1&&n.push([e+1,t]),t>0&&n.push([e,t-1]),t<g-1&&n.push([e,t+1]),n}function a(e,t){y.x=e.clientX/s*2-1,y.y=e.clientY/p*-2+1,M.setFromCamera(y,f);var n=M.intersectObjects(m);if(n.length>0){r([n[0].object],I)}else t&&r([m[Math.floor(m.length*Math.random())]],I)}function r(e,t){for(;t>0;){for(var n=0,o=e.length;n<o;n++){var a=e.shift();a.ripple<0&&(a.ripple=2*(I-t),a.adjacents.forEach(function(n){var o=m[n[0]*g+n[1]];Math.random()>1-t/80&&e.push(o)}))}t--}}function i(e,t){for(var n=e.createLinearGradient(0,256,0,0),o=0,a=t.length-1;o<a;o++)n.addColorStop(o/a,t[o]);return n.addColorStop(1,t[t.length-1]),e.fillStyle=n,e.fillRect(0,0,256,256),n}function h(){requestAnimationFrame(h),m.forEach(function(e,t){e.rotation.x>.05?e.rotation.x/=1.1:e.rotation.x=0,0==e.ripple&&(e.rotation.x=Math.PI-2+2*Math.random()),e.ripple>=0&&e.ripple--,e.material.uniforms.rotation.value=e.rotation.x,e.position.z=Math.min(f.position.z/3,e.rotation.x/Math.PI*s/8)+10*Math.sin((Date.now()-x)/300+t/2)}),c.render(d,f)}var d,f,c,l,u,s=document.getElementById("container").offsetWidth,p=window.outerHeight,m=[],E=30,w=s/E,v=Math.ceil(E*p/s),g=E,x=Date.now(),y={},M=new THREE.Raycaster,R=["black","#771122","red","#ffeeee","white","#ff7777","white"],H=["black","#250101","#370000","#aa4400","white","orange","white","#eeee33","white"],T=["black","#007733","white","#11ff33","white"],b=["black","#003377","white","#00ffff","white"],k=["black","#662233","magenta","white","pink","pink","white"],S=[R,H,T,b,k],C=Math.floor(Math.random()*S.length),I=30,B=!0;e()};