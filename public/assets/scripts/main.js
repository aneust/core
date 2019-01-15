biigle={},biigle.$viewModel=function(e,t){window.addEventListener("load",function(){var n=document.getElementById(e);n&&t(n)})},biigle.$require=function(e){e=Array.isArray(e)?e:e.split(".");for(var t=biigle,n=0,i=e.length;n<i;n++)t.hasOwnProperty(e[n])||(t[e[n]]={}),t=t[e[n]];return t},biigle.$declare=function(e,t){e=e.split(".");var n=e.pop();return biigle.$require(e)[n]="function"==typeof t?t():t,t},biigle.$component=function(e,t){var n=biigle.$require(e);"function"==typeof t&&(t=t());for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);return n},biigle.$viewModel("video-container",function(e){var t=biigle.$require("videoSrc");new Vue({el:e,components:{videoScreen:biigle.$require("components.videoScreen"),videoTimeline:biigle.$require("components.videoTimeline")},data:{video:document.createElement("video"),annotations:[{id:1,selected:!1,points:{frames:[5,7.5,10],coordinates:[[100,100],[100,200],[200,100]]},labels:[{id:1,name:"label 1",color:"ff00ff"},{id:2,name:"label 2",color:"00ff00"}]},{id:2,selected:!1,points:{frames:[2.5],coordinates:[[500,500]]},labels:[{id:1,name:"label 1",color:"ff00ff"}]},{id:22,selected:!1,points:{frames:[3.5],coordinates:[[500,500]]},labels:[{id:1,name:"label 1",color:"ff00ff"}]},{id:3,selected:!1,points:{frames:[9,13],coordinates:[[500,500],[600,600]]},labels:[{id:1,name:"label 1",color:"ff00ff"}]},{id:33,selected:!1,points:{frames:[2,3,4,5,6],coordinates:[[500,500],[510,510],[530,530],[560,560],[600,600]]},labels:[{id:1,name:"label 1",color:"ff00ff"}]},{id:4,selected:!1,points:{frames:[1,4.5],coordinates:[[300,300],[300,400]]},labels:[{id:2,name:"label 2",color:"00ff00"}]},{id:5,selected:!1,points:{frames:[1,4],coordinates:[[300,300],[300,400]]},labels:[{id:2,name:"label 2",color:"00ff00"}]},{id:6,selected:!1,points:{frames:[4,11],coordinates:[[600,600],[600,500]]},labels:[{id:2,name:"label 2",color:"00ff00"}]},{id:7,selected:!1,points:{frames:[10.5,14],coordinates:[[600,600],[600,500]]},labels:[{id:2,name:"label 2",color:"00ff00"}]},{id:7,selected:!1,points:{frames:[11,14],coordinates:[[600,600],[600,500]]},labels:[{id:2,name:"label 2",color:"00ff00"}]}]},computed:{},methods:{seek:function(e){this.video.currentTime=e},selectAnnotation:function(e,t){this.deselectAnnotations(),e.selected=t,this.video.currentTime=e.points.frames[t]},deselectAnnotations:function(){this.annotations.forEach(function(e){e.selected=!1})}},created:function(){this.video.muted=!0},mounted:function(){this.video.src=t}})}),biigle.$declare("stores.styles",function(){var e={white:[255,255,255,1],blue:[0,153,255,1],orange:"#ff5e00"},t={},n=new ol.style.Stroke({color:e.white,width:5}),i=new ol.style.Stroke({color:e.white,width:6}),o=new ol.style.Stroke({color:e.blue,width:3}),a=new ol.style.Stroke({color:e.orange,width:3}),r=new ol.style.Fill({color:e.blue}),s=new ol.style.Fill({color:e.orange}),l=new ol.style.Stroke({color:e.white,width:2}),c=new ol.style.Stroke({color:e.white,width:3}),d=new ol.style.Stroke({color:e.white,width:2,lineDash:[3]}),u=new ol.style.Stroke({color:e.blue,width:3,lineDash:[5]});new ol.style.Fill({color:e.blue}),new ol.style.Fill({color:e.orange});return{colors:e,features:function(i){var o=i.get("color");return o=o?"#"+o:e.blue,t.hasOwnProperty(o)||(t[o]=[new ol.style.Style({stroke:n,image:new ol.style.Circle({radius:6,fill:new ol.style.Fill({color:o}),stroke:l})}),new ol.style.Style({stroke:new ol.style.Stroke({color:o,width:3})})]),t[o]},highlight:[new ol.style.Style({stroke:i,image:new ol.style.Circle({radius:6,fill:s,stroke:c}),zIndex:200}),new ol.style.Style({stroke:a,zIndex:200})],editing:[new ol.style.Style({stroke:n,image:new ol.style.Circle({radius:6,fill:r,stroke:d})}),new ol.style.Style({stroke:u})],viewport:[new ol.style.Style({stroke:o}),new ol.style.Style({stroke:new ol.style.Stroke({color:e.white,width:1})})],cross:[new ol.style.Style({image:new ol.style.RegularShape({stroke:i,points:4,radius1:6,radius2:0,angle:Math.PI/4})}),new ol.style.Style({image:new ol.style.RegularShape({stroke:a,points:4,radius1:6,radius2:0,angle:Math.PI/4})})]}}),biigle.$component("components.annotationClip",{template:'<div class="annotation-clip" :style="style" :class="classObj" @click.stop="emitSelectFrame(0)"><keyframe v-for="(frame, i) in keyframes" :frame="frame" @select="emitSelectFrame(i)"></keyframe></div>',components:{keyframe:{template:'<span class="annotation-keyframe" :style="style" :class="classObj" @click.stop="emitSelect"></span>',props:{frame:{type:Object,required:!0}},computed:{offset:function(){return(this.frame.time-this.$parent.startFrame)/this.$parent.clipDuration},style:function(){return{left:100*this.offset+"%","background-color":"#"+this.$parent.color}},classObj:function(){return{"annotation-keyframe--selected":this.frame.selected}}},methods:{emitSelect:function(){this.$emit("select")}}}},props:{annotation:{type:Object,required:!0},labelId:{type:String,required:!0},duration:{type:Number,required:!0}},data:function(){return{}},computed:{startFrame:function(){return this.annotation.points.frames[0]},endFrame:function(){return this.annotation.points.frames[this.annotation.points.frames.length-1]},offset:function(){return this.startFrame/this.duration},clipDuration:function(){return this.endFrame-this.startFrame},width:function(){return this.clipDuration/this.duration},color:function(){for(var e=parseInt(this.labelId),t=this.annotation.labels.length-1;t>=0;t--)if(this.annotation.labels[t].id===e)return this.annotation.labels[t].color;return"000000"},style:function(){return{left:100*this.offset+"%",width:100*this.width+"%","background-color":"#"+this.color+"66"}},keyframes:function(){var e=this.annotation.selected;return this.annotation.points.frames.map(function(t,n){return{time:t,selected:e===n}})},selected:function(){return!1!==this.annotation.selected},classObj:function(){return{"annotation-clip--selected":this.selected}}},methods:{emitSelectFrame:function(e){this.$emit("select",this.annotation,e)}},mounted:function(){}}),biigle.$component("components.annotationTrack",{template:'<div class="annotation-track"><div class="annotation-lane" v-for="lane in lanes"><annotation-clip v-for="annotation in lane" :annotation="annotation" :label-id="labelId" :duration="duration" @select="emitSelect"></annotation-clip></div></div>',components:{annotationClip:biigle.$require("components.annotationClip")},props:{annotations:{type:Array,required:!0},labelId:{type:String,required:!0},duration:{type:Number,required:!0}},data:function(){return{}},computed:{lanes:function(){var e=[[]],t=[[]];return this.annotations.forEach(function(n){var i=[n.points.frames[0],n.points.frames[n.points.frames.length-1]],o=0,a=!1;e:for(;!a;){if(t[o]){for(var r=e[o].length-1;r>=0;r--)if(this.rangesCollide(e[o][r],i)){o+=1;continue e}}else e[o]=[],t[o]=[];e[o].push(i),t[o].push(n),a=!0}},this),t}},methods:{emitSelect:function(e,t){this.$emit("select",e,t)},rangesCollide:function(e,t){return e[0]>=t[0]&&e[0]<t[1]||e[1]>t[0]&&e[1]<=t[1]||t[0]>=e[0]&&t[0]<e[1]||t[1]>e[0]&&t[1]<=e[1]||e[0]===t[0]&&e[1]===t[1]}},watch:{lanes:{immediate:!0,handler:function(e){this.$emit("update",this.labelId,e.length)}}}}),biigle.$component("components.annotationTracks",{template:'<div class="annotation-tracks" @click="emitDeselect" @scroll.stop="handleScroll"><annotation-track v-for="(annotations, labelId) in tracks" :annotations="annotations" :labelId="labelId" :duration="duration" @select="emitSelect" @update="emitUpdate"></annotation-track></div>',components:{annotationTrack:biigle.$require("components.annotationTrack")},props:{annotations:{type:Array,default:function(){return[]}},duration:{type:Number,required:!0},elementWidth:{type:Number,required:!0}},data:function(){return{}},computed:{tracks:function(){var e={};return this.annotations.forEach(function(t){t.labels.forEach(function(n){e.hasOwnProperty(n.id)||(e[n.id]=[]),e[n.id].push(t)})}),e}},methods:{emitSelect:function(e,t){this.$emit("select",e,t)},emitDeselect:function(){this.$emit("deselect")},emitUpdate:function(e,t){this.$emit("update",e,t)},handleScroll:function(){this.$emit("scroll-y",this.$el.scrollTop)}}}),biigle.$component("components.controlButton",{template:'<span class="control-button btn" :title="title" :class="classObject" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"><i :class="iconClass" aria-hidden="true"></i><span v-if="hasSubControls" @click.stop class="control-button__sub-controls btn-group"><slot></slot></span></span>',props:{title:{type:String,default:""},icon:{type:String,required:!0},active:{type:Boolean,default:!1}},data:function(){return{mouseOver:!1,timeout:null,activeSubControls:0}},computed:{classObject:function(){return{active:this.active,"control-button--open":this.showSubControls}},iconClass:function(){return this.icon.startsWith("fa-")?"fa "+this.icon:"icon icon-white "+this.icon},hasSubControls:function(){return this.$slots.hasOwnProperty("default")},showSubControls:function(){return this.mouseOver||this.hasActiveSubControl},hasActiveSubControl:function(){return this.activeSubControls>0}},methods:{handleClick:function(){this.$emit("click")},handleMouseEnter:function(){this.mouseOver=!0,window.clearTimeout(this.timeout)},handleMouseLeave:function(){var e=this;window.clearTimeout(this.timeout),this.timeout=window.setTimeout(function(){e.mouseOver=!1},200)},updateActiveSubControls:function(e){e?this.activeSubControls++:this.activeSubControls--}},watch:{active:function(e){this.$parent.$emit("control-button-active",e)}},created:function(){this.$on("control-button-active",this.updateActiveSubControls)}}),biigle.$component("components.currentTimeIndicator",{template:'<span class="time-indicator" :style="style"></span>',props:{duration:{type:Number,required:!0},currentTime:{type:Number,required:!0}},data:function(){return{parentWidth:0}},computed:{style:function(){if(this.duration>0){return"transform: translateX("+this.parentWidth*this.currentTime/this.duration+"px);"}}},methods:{updateParentWidth:function(){this.parentWidth=this.$el.parentElement.clientWidth}},mounted:function(){this.updateParentWidth()}}),biigle.$component("components.scrollStrip",{template:'<div class="scroll-strip"><video-progress :duration="duration" @seek="emitSeek"></video-progress><annotation-tracks :annotations="annotations" :duration="duration" :element-width="elementWidth" @select="emitSelect" @deselect="emitDeselect" @update="emitUpdateTracks" @scroll-y="emitScrollY"></annotation-tracks><span class="time-indicator" :style="indicatorStyle"></span></div>',components:{videoProgress:biigle.$require("components.videoProgress"),annotationTracks:biigle.$require("components.annotationTracks")},props:{annotations:{type:Array,required:function(){return[]}},duration:{type:Number,required:!0},currentTime:{type:Number,required:!0}},data:function(){return{elementWidth:0}},computed:{currentTimeOffset:function(){return this.duration>0?Math.round(this.elementWidth*this.currentTime/this.duration):0},indicatorStyle:function(){return"transform: translateX("+this.currentTimeOffset+"px);"}},methods:{updateElementWidth:function(){this.elementWidth=this.$el.clientWidth},emitSeek:function(e){this.$emit("seek",e/this.elementWidth*this.duration)},emitSelect:function(e,t){this.$emit("select",e,t)},emitDeselect:function(){this.$emit("deselect")},emitUpdateTracks:function(e,t){this.$emit("update-tracks",e,t)},emitScrollY:function(e){this.$emit("scroll-y",e)}},mounted:function(){this.updateElementWidth(),window.addEventListener("resize",this.updateElementWidth)}}),biigle.$component("components.trackHeaders",{template:'<div class="track-headers"><div class="track-header" v-for="track in tracks"><div class="label-name" v-text="track.label.name"></div><div class="lane-dummy" v-for="lane in track.lanes"></div></div></div>',props:{labels:{type:Object,required:!0},laneCounts:{type:Object,default:function(){return{}}},scrollTop:{type:Number,default:0}},data:function(){return{}},computed:{tracks:function(){return Object.keys(this.laneCounts).map(function(e){return{label:this.labels[e],lanes:Array.apply(null,{length:this.laneCounts[e]})}},this)}},methods:{},watch:{scrollTop:function(e){this.$el.scrollTop=e}}}),biigle.$component("components.videoProgress",{template:'<div class="video-progress" @click="emitSeek"></div>',props:{duration:{type:Number,required:!0}},data:function(){return{}},computed:{},methods:{emitSeek:function(e){this.$emit("seek",e.clientX-e.target.getBoundingClientRect().left)}},mounted:function(){}}),biigle.$component("components.videoScreen",{template:'<div class="video-screen"><div class="controls"><div class="btn-group"><control-button v-if="playing" icon="fa-pause" title="Pause" v-on:click="pause"></control-button><control-button v-else icon="fa-play" title="Play" v-on:click="play"></control-button></div></div></div>',components:{controlButton:biigle.$require("components.controlButton")},props:{video:{type:HTMLVideoElement,required:!0},annotations:{type:Array,default:function(){return[]}}},data:function(){return{playing:!1,animationFrameId:null,refreshRate:100,refreshLastTime:Date.now(),renderedAnnotationMap:{}}},computed:{annotationsPreparedToRender:function(){return this.annotations.map(function(e){return{id:e.id,start:e.points.frames[0],end:e.points.frames[e.points.frames.length-1],self:e}}).sort(function(e,t){return e.start-t.start})}},methods:{createMap:function(){return new ol.Map({renderer:"canvas",interactions:ol.interaction.defaults({altShiftDragRotate:!1,doubleClickZoom:!1,keyboard:!1,shiftDragZoom:!1,pinchRotate:!1,pinchZoom:!1})})},createVideoLayer:function(){this.videoCanvas.width=this.video.videoWidth,this.videoCanvas.height=this.video.videoHeight;var e=[0,0,this.videoCanvas.width,this.videoCanvas.height],t=new ol.proj.Projection({code:"biigle-image",units:"pixels",extent:e});this.videoLayer=new ol.layer.Image({map:this.map,source:new ol.source.Canvas({canvas:this.videoCanvas,projection:this.projection,canvasExtent:e,canvasSize:[e[0],e[1]]})}),this.map.setView(new ol.View({projection:t,minResolution:.25,extent:e})),this.map.getView().fit(e),this.annotationLayer.setMap(this.map)},createAnnotationLayer:function(){this.annotationFeatures=new ol.Collection,this.annotationSource=new ol.source.Vector({features:this.annotationFeatures}),this.annotationLayer=new ol.layer.Vector({source:this.annotationSource,updateWhileAnimating:!0,updateWhileInteracting:!0,style:biigle.$require("stores.styles").features})},renderVideo:function(){this.videoCanvasCtx.drawImage(this.video,0,0,this.video.videoWidth,this.video.videoHeight),this.videoLayer.changed();var e=Date.now();e-this.refreshLastTime>this.refreshRate&&(this.refreshAnnotations(this.video.currentTime),this.refreshLastTime=e)},startRenderLoop:function(){this.renderVideo(),this.animationFrameId=window.requestAnimationFrame(this.startRenderLoop)},stopRenderLoop:function(){window.cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null},setPlaying:function(){this.playing=!0},setPaused:function(){this.playing=!1},play:function(){this.video.play()},pause:function(){this.video.pause()},refreshAnnotations:function(e){var t=this.annotationSource,n=this.annotationsPreparedToRender,i=this.renderedAnnotationMap,o={};this.renderedAnnotationMap=o;for(var a,r={},s={},l=0,c=n.length;l<c;l++)if(!(n[l].end<=e)){if(n[l].start>e)break;a=n[l],i.hasOwnProperty(a.id)?(r[a.id]=i[a.id],delete i[a.id]):s[a.id]=a.self}Object.values(i).forEach(function(e){t.removeFeature(e)});var d=Object.values(s).map(this.createFeature);d.forEach(function(e){o[e.getId()]=e}),d.length>0&&t.addFeatures(d),Object.assign(o,r)},createFeature:function(e){var t=new ol.Feature(new ol.geom.Point(e.points.coordinates[0]));return t.setId(e.id),t.set("annotation",e),e.labels&&e.labels.length>0&&t.set("color",e.labels[0].color),t}},watch:{playing:function(e){e&&!this.animationFrameId?this.startRenderLoop():e||this.stopRenderLoop()}},created:function(){this.map=this.createMap(),this.videoCanvas=document.createElement("canvas"),this.videoCanvasCtx=this.videoCanvas.getContext("2d"),this.video.addEventListener("loadedmetadata",this.createVideoLayer),this.video.addEventListener("play",this.setPlaying),this.video.addEventListener("pause",this.setPaused),this.video.addEventListener("seeked",this.renderVideo),this.video.addEventListener("loadeddata",this.renderVideo),this.createAnnotationLayer()},mounted:function(){this.map.setTarget(this.$el)}}),biigle.$component("components.videoTimeline",{template:'<div class="video-timeline"><div class="static-strip"><div class="current-time" v-text="currentTimeString"></div><track-headers ref="trackheaders" :labels="labelMap" :lane-counts="laneCounts" :scroll-top="scrollTop"></track-headers></div><scroll-strip :annotations="annotations" :duration="duration" :current-time="currentTime" @seek="emitSeek" @select="emitSelect" @deselect="emitDeselect" @update-tracks="handleUpdatedTracks" @scroll-y="handleScrollY"></scroll-strip></div>',components:{trackHeaders:biigle.$require("components.trackHeaders"),scrollStrip:biigle.$require("components.scrollStrip")},props:{annotations:{type:Array,default:function(){return[]}},video:{type:HTMLVideoElement,required:!0}},data:function(){return{animationFrameId:null,refreshRate:100,refreshLastTime:Date.now(),currentTime:0,currentTimeDate:new Date(0),currentTimeString:"00:00:00.000",duration:0,laneCounts:{},scrollTop:0}},computed:{labelMap:function(){var e={};return this.annotations.forEach(function(t){t.labels.forEach(function(t){e.hasOwnProperty(t.id)||(e[t.id]=t)})}),e}},methods:{startUpdateLoop:function(){var e=Date.now();e-this.refreshLastTime>this.refreshRate&&(this.updateCurrentTime(),this.refreshLastTime=e),this.animationFrameId=window.requestAnimationFrame(this.startUpdateLoop)},stopUpdateLoop:function(){this.updateCurrentTime(),window.cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null},updateCurrentTime:function(){this.currentTime=this.video.currentTime,this.currentTimeDate.setTime(1e3*this.currentTime),this.currentTimeString=this.currentTimeDate.toISOString().split("T")[1].slice(0,-1)},setDuration:function(){this.duration=this.video.duration},emitSeek:function(e){this.$emit("seek",e)},emitSelect:function(e,t){this.$emit("select",e,t)},emitDeselect:function(){this.$emit("deselect")},handleUpdatedTracks:function(e,t){Vue.set(this.laneCounts,e,t)},handleScrollY:function(e){this.scrollTop=e}},watch:{},created:function(){this.video.addEventListener("play",this.startUpdateLoop),this.video.addEventListener("pause",this.stopUpdateLoop),this.video.addEventListener("loadedmetadata",this.setDuration),this.video.addEventListener("seeked",this.updateCurrentTime)},mounted:function(){}});