var cssSlidy=function(e){var n=function(){var n={},i={timeOnSlide:3,timeBetweenSlides:1,slidyContainerSelector:"#slidy-container",slidySelector:"#slidy",slidyDirection:"left",fallbackFunction:function(){},cssAnimationName:"slidy",captionSource:"data-caption",captionBackground:"rgba(0,0,0,0.3)",captionColor:"#fff",captionFont:"Avenir, Avenir Next, Droid Sans, DroidSansRegular, Corbel, Tahoma, Geneva, sans-serif",captionPosition:"bottom",captionAppear:"slide",captionSize:"1.6rem",captionPadding:".6rem"};for(var t in i)n[t]=i[t];for(var t in e)n[t]=e[t];return n}(),i=this;i.animationString="animation",i.hasAnimation=!1,i.keyframeprefix="",i.domPrefixes="Webkit Moz O Khtml".split(" "),i.pfx="",i.element=document.getElementById(n.slidySelector.replace("#","")),i.init=function(){if(i.element.style.animationName!==undefined&&(i.hasAnimation=!0),!1===i.hasAnimation)for(var e=0;e<i.domPrefixes.length;e++)if(i.element.style[i.domPrefixes[e]+"AnimationName"]!==undefined){i.pfx=domPrefixes[e],i.animationString=pfx+"Animation",i.keyframeprefix="-"+pfx.toLowerCase()+"-",i.hasAnimation=!0;break}if(!0===i.hasAnimation){for(var t,o,a=i.element.getElementsByTagName("img"),r=a.length,l=document.createElement("figure");r;)o=l.cloneNode(!1),t=a[--r],"alt"!==n.captionSource&&"data-caption"!==n.captionSource||(caption=t.getAttribute(n.captionSource)),t.parentNode.insertBefore(o,t),"alt"!=n.captionSource&&"data-caption"!=n.captionSource||null!==caption&&(content=document.createElement("figcaption"),content.innerHTML=caption),o.appendChild(t),"none"!==n.captionSource&&null!==caption&&o.appendChild(content);var c=i.element.getElementsByTagName("figure"),s=c[0];figWrap=s.cloneNode(!0),i.element.appendChild(figWrap);var d=a.length,p=(n.timeOnSlide+n.timeBetweenSlides)*(d-1),f=n.timeOnSlide/p*100,m=n.timeBetweenSlides/p*100,g=100/d,u=0,y=document.createElement("style");if(y.type="text/css",y.id=n.slidySelector.replace("#","")+"-css",y.innerHTML+=n.slidyContainerSelector+" { overflow: hidden; }\n",y.innerHTML+=n.slidySelector+" { text-align: left; margin: 0; font-size: 0; position: relative; width: "+100*d+"%;  }\n",y.innerHTML+=n.slidySelector+" figure { float: left; margin: 0; position: relative; display: inline-block; width: "+g+"%; height: auto; }\n",y.innerHTML+=n.slidySelector+" figure img { width: 100%; }\n","alt"==n.captionSource||"data-caption"==n.captionSource){y.innerHTML+=n.slidySelector+" figure figcaption { position: absolute; width: 100%; background-color: "+n.captionBackground+"; color: "+n.captionColor+"; font-family: "+n.captionFont+";";var S=document.getElementsByTagName("figcaption"),T=2*S[0].offsetHeight+parseInt(window.getComputedStyle(S[0]).fontSize,10);if("top"==n.captionPosition)switch(n.captions){case"fade":y.innerHTML+=" top: 0; opacity: 0;";break;case"slide":y.innerHTML+=" top: -"+T+"px; ";break;default:y.innerHTML+=" top: 0;"}else switch(n.captionAppear){case"fade":y.innerHTML+=" bottom: 0; opacity: 0;";break;case"slide":y.innerHTML+=" bottom: -"+T+"px; ";break;default:y.innerHTML+=" bottom: 0;"}y.innerHTML+=" font-size: "+n.captionSize+"; padding: "+n.captionPadding+"; "+keyframeprefix+"transition: .5s; }\n",y.innerHTML+=n.slidySelector+":hover figure figcaption { opacity: 1; ","top"==n.captionPosition?y.innerHTML+=" top: 0px;":y.innerHTML+=" bottom: 0px;",y.innerHTML+=" }\n"}if(y.innerHTML+="@"+keyframeprefix+"keyframes "+n.cssAnimationName+" {\n","right"==n.slidyDirection)for(e=d-1;e>0;e--)u+=f,y.innerHTML+=u+"% { left: -"+100*e+"%; }\n",u+=m,y.innerHTML+=u+"% { left: -"+100*(e-1)+"%; }\n";else for(e=0;e<d-1;e++)u+=f,y.innerHTML+=u+"% { left: -"+100*e+"%; }\n",u+=m,y.innerHTML+=u+"% { left: -"+100*(e+1)+"%; }\n";y.innerHTML+="}\n",y.innerHTML+=n.slidySelector+" { ","right"==n.slidyDirection?y.innerHTML+="left: "+100*d+"%":y.innerHTML+="left: 0%; ",y.innerHTML+=keyframeprefix+"transform: translate3d(0,0,0); "+keyframeprefix+"animation: "+p+"s "+n.cssAnimationName+" infinite; }\n",n.cssLocation!==undefined?n.cssLocation.appendChild(y):document.body.appendChild(y)}else n.fallbackFunction()}()};