function BufferLoader(r,o,e){this.context=r,this.urlList=o,this.onload=e,this.bufferList=new Array,this.loadCount=0}BufferLoader.prototype.loadBuffer=function(r,o){var e=new XMLHttpRequest;e.open("GET",r,!0),e.responseType="arraybuffer";var t=this;e.onload=function(){t.context.decodeAudioData(e.response,function(e){if(!e)return void alert("error decoding file data: "+r);t.bufferList[o]=e,++t.loadCount==t.urlList.length&&t.onload(t.bufferList)},function(r){console.error("decodeAudioData error",r)})},e.onerror=function(){alert("BufferLoader: XHR error")},e.send()},BufferLoader.prototype.load=function(){for(var r=0;r<this.urlList.length;++r)this.loadBuffer(this.urlList[r],r)};