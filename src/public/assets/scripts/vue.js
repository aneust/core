biigle.$viewModel("annotations-navbar",function(e){new Vue({el:e,data:{currentImageFilename:"",filenameMap:{}},methods:{updateFilename:function(e){this.currentImageFilename=this.filenameMap[e]}},watch:{currentImageFilename:function(e){document.title="Annotate "+e}},created:function(){var e=biigle.$require("biigle.events"),t=biigle.$require("annotations.imagesIds"),n=biigle.$require("annotations.imagesFilenames"),o=this.filenameMap;t.forEach(function(e,t){o[e]=n[t]}),e.$on("images.change",this.updateFilename)}})}),biigle.$viewModel("annotator-container",function(e){var t=biigle.$require("biigle.events"),n=biigle.$require("annotations.imagesIds"),o=biigle.$require("annotations.stores.images"),i=biigle.$require("annotations.stores.annotations"),a=biigle.$require("volumes.urlParams");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],components:{sidebar:biigle.$require("annotations.components.sidebar"),sidebarTab:biigle.$require("core.components.sidebarTab"),labelsTab:biigle.$require("annotations.components.labelsTab"),annotationCanvas:biigle.$require("annotations.components.annotationCanvas")},data:{currentImageIndex:null,currentImage:null,currentAnnotations:null,mapCenter:void 0,mapResolution:void 0},computed:{currentImageId:function(){return n[this.currentImageIndex]},currentImagePromise:function(){return o.fetchImage(this.currentImageId)},currentAnnotationsPromise:function(){return i.fetchAnnotations(this.currentImageId)}},methods:{setCurrentImageAndAnnotations:function(e){this.currentImage=e[0],this.currentAnnotations=e[1]},getNextIndex:function(e){return(e+1)%n.length},getPreviousIndex:function(e){return(e+n.length-1)%n.length},nextImage:function(){this.loading||(this.currentImageIndex=this.getNextIndex(this.currentImageIndex))},previousImage:function(){this.loading||(this.currentImageIndex=this.getPreviousIndex(this.currentImageIndex))},handleMapMoveend:function(e){this.mapCenter=e.center,this.mapResolution=e.resolution,a.set({r:Math.round(100*e.resolution),x:Math.round(e.center[0]),y:Math.round(e.center[1])})}},watch:{currentImageIndex:function(e){var o=n[this.getPreviousIndex(e)],i=n[this.getNextIndex(e)];t.$emit("images.change",this.currentImageId,o,i),this.startLoading(),Vue.Promise.all([this.currentImagePromise,this.currentAnnotationsPromise]).then(this.setCurrentImageAndAnnotations).then(this.finishLoading)}},created:function(){this.startLoading();var e=biigle.$require("labelTrees.stores.keyboard");e.on(37,this.previousImage),e.on(32,this.nextImage),e.on(39,this.nextImage),this.currentImageIndex=n.indexOf(biigle.$require("annotations.imageId")),void 0!==a.get("r")&&(this.mapResolution=parseInt(a.get("r"),10)/100),void 0!==a.get("x")&&void 0!==a.get("y")&&(this.mapCenter=[parseInt(a.get("x"),10),parseInt(a.get("y"),10)])}})}),biigle.$component("annotations.components.annotationCanvas",function(){var e=new ol.Map({renderer:"canvas",controls:[new ol.control.Zoom,new ol.control.ZoomToExtent({tipLabel:"Zoom to show whole image",label:""}),new ol.control.FullScreen({label:""})],interactions:ol.interaction.defaults({altShiftDragRotate:!1,doubleClickZoom:!1,keyboard:!1,shiftDragZoom:!1,pinchRotate:!1,pinchZoom:!1})}),t=new ol.layer.Image;e.addLayer(t);var n=new ol.Collection,o=new ol.source.Vector({features:n}),i=new ol.layer.Vector({source:o,zIndex:100,updateWhileAnimating:!0,updateWhileInteracting:!0});return e.addLayer(i),{components:{loaderBlock:biigle.$require("core.components.loaderBlock")},props:{image:{type:HTMLCanvasElement},annotations:{type:Array,default:function(){return[]}},loading:{type:Boolean,default:!1},center:{type:Array,default:void 0},resolution:{type:Number,default:void 0}},data:function(){return{initialized:!1}},computed:{extent:function(){return this.image?[0,0,this.image.width,this.image.height]:[0,0,0,0]},projection:function(){return new ol.proj.Projection({code:"biigle-image",units:"pixels",extent:this.extent})}},methods:{getGeometry:function(e){for(var t=e.points,n=[],o=this.image.height,i=0;i<t.length;i+=2)n.push([t[i],o-(t[i+1]||0)]);switch(e.shape){case"Point":return new ol.geom.Point(n[0]);case"Rectangle":return new ol.geom.Rectangle([n]);case"Polygon":return new ol.geom.Polygon([n]);case"LineString":return new ol.geom.LineString(n);case"Circle":return new ol.geom.Circle(n[0],n[1][0]);default:return void console.error("Unknown annotation shape: "+e.shape)}},createFeature:function(e){var t=new ol.Feature({geometry:this.getGeometry(e),id:e.id});return t.set("annotation",e),e.labels&&e.labels.length>0&&t.set("color",e.labels[0].label.color),t}},watch:{image:function(e){t.setSource(new ol.source.Canvas({canvas:e,projection:this.projection,canvasExtent:this.extent,canvasSize:[e.width,e.height]}))},annotations:function(e){o.clear(!0),o.addFeatures(this.annotations.map(this.createFeature))},extent:function(t,n){if(t[2]!==n[2]||t[3]!==n[3]){var o=ol.extent.getCenter(t);this.initialized||(o=this.center||o,this.initialized=!0),e.setView(new ol.View({projection:this.projection,center:o,resolution:this.resolution,zoomFactor:1.5,minResolution:.25,extent:t})),void 0===this.resolution&&e.getView().fit(t,e.getSize())}}},created:function(){var t=this;biigle.$require("biigle.events").$on("sidebar.toggle",function(){t.$nextTick(function(){e.updateSize()})}),e.on("moveend",function(n){var o=e.getView();t.$emit("moveend",{center:o.getCenter(),resolution:o.getResolution()})}),i.setStyle(biigle.$require("annotations.stores.styles").features)},mounted:function(){e.setTarget(this.$el);var t=biigle.$require("annotations.ol.ZoomToNativeControl");e.addControl(new t({label:""}))}}}),biigle.$component("annotations.components.labelsTab",{components:{labelTrees:biigle.$require("labelTrees.components.labelTrees")},props:{},data:function(){return{labelTrees:biigle.$require("annotations.labelTrees")}},methods:{handleSelectedLabel:function(e){},handleDeselectedLabel:function(e){}}}),biigle.$component("annotations.components.sidebar",{mixins:[biigle.$require("core.components.sidebar")],created:function(){}}),biigle.$declare("annotations.ol.ZoomToNativeControl",function(){function e(e){var t=e||{},n=t.label?t.label:"1",o=document.createElement("button"),i=this;o.innerHTML=n,o.title="Zoom to original resolution",o.addEventListener("click",function(){i.zoomToNative.call(i)});var a=document.createElement("div");a.className="zoom-to-native ol-unselectable ol-control",a.appendChild(o),ol.control.Control.call(this,{element:a,target:t.target}),this.duration_=void 0!==t.duration?t.duration:250}return ol.inherits(e,ol.control.Control),e.prototype.zoomToNative=function(){var e=this.getMap(),t=e.getView();if(t){var n=t.getResolution();n&&(this.duration_>0&&e.beforeRender(ol.animation.zoom({resolution:n,duration:this.duration_,easing:ol.easing.easeOut})),t.setResolution(t.constrainResolution(1)))}},e}),biigle.$declare("annotations.stores.annotations",function(){var e=biigle.$require("biigle.events"),t=biigle.$require("api.images");biigle.$require("api.annotations");return new Vue({data:{cache:{}},computed:{imageFileUri:function(){return biigle.$require("annotations.imageFileUri")},shapeMap:function(){return biigle.$require("annotations.shapes")}},methods:{parseAnnotations:function(e){var t=new Vue.Promise(function(t,n){200===e.status?t(e.data):n("Failed to load annotations!")});return t},resolveShapes:function(e){return e.forEach(function(e){e.shape=this.shapeMap[e.shape_id]},this),e},fetchAnnotations:function(e){return this.cache.hasOwnProperty(e)||(this.cache[e]=t.getAnnotations({id:e}).then(this.parseAnnotations).then(this.resolveShapes)),this.cache[e]},updateCache:function(e,t,n){var o=this;this.fetchAnnotations(e).then(function(){o.fetchAnnotations(n)}).then(function(){o.fetchAnnotations(t)})}},created:function(){e.$on("images.change",this.updateCache)}})}),biigle.$declare("annotations.stores.images",function(){var e=biigle.$require("biigle.events");return new Vue({data:{cache:{},cachedIds:[],maxCacheSize:10},computed:{imageFileUri:function(){return biigle.$require("annotations.imageFileUri")}},methods:{createImage:function(e){var t=document.createElement("img"),n=new Vue.Promise(function(n,o){t.onload=function(){n(this)},t.onerror=function(){o("Failed to load image "+e+"!")}});return t.src=this.imageFileUri.replace("{id}",e),n},drawImage:function(e){var t=document.createElement("canvas");return t.width=e.width,t.height=e.height,t.getContext("2d").drawImage(e,0,0),t},fetchImage:function(e){return this.cache.hasOwnProperty(e)||(this.cache[e]=this.createImage(e),this.cachedIds.push(e)),this.cache[e].then(this.drawImage)},updateCache:function(e,t,n){var o=this;this.fetchImage(e).then(function(){o.fetchImage(n)}).then(function(){o.fetchImage(t)})}},watch:{cachedIds:function(e){if(e.length>this.maxCacheSize){var t=e.shift(),n=this.cache[t];url.revokeObjectURL(n.src),delete this.cache[t]}}},created:function(){e.$on("images.change",this.updateCache)}})}),biigle.$declare("annotations.stores.styles",function(){var e={white:[255,255,255,1],blue:[0,153,255,1],orange:"#ff5e00"},t=6,n=3,o=new ol.style.Stroke({color:e.white,width:5}),i=new ol.style.Stroke({color:e.white,width:6}),a=new ol.style.Stroke({color:e.blue,width:n}),r=new ol.style.Stroke({color:e.orange,width:n}),s=new ol.style.Fill({color:e.blue}),l=new ol.style.Fill({color:e.orange}),c=new ol.style.Stroke({color:e.white,width:2}),u=new ol.style.Stroke({color:e.white,width:n}),h=new ol.style.Stroke({color:e.white,width:2,lineDash:[3]}),g=new ol.style.Stroke({color:e.blue,width:n,lineDash:[5]});new ol.style.Fill({color:e.blue}),new ol.style.Fill({color:e.orange});return{colors:e,features:function(e){var n=e.get("color");return n=n?"#"+n:_colors.blue,[new ol.style.Style({stroke:o,image:new ol.style.Circle({radius:t,fill:new ol.style.Fill({color:n}),stroke:c})}),new ol.style.Style({stroke:new ol.style.Stroke({color:n,width:3})})]},highlight:[new ol.style.Style({stroke:i,image:new ol.style.Circle({radius:t,fill:l,stroke:u}),zIndex:200}),new ol.style.Style({stroke:r,zIndex:200})],editing:[new ol.style.Style({stroke:o,image:new ol.style.Circle({radius:t,fill:s,stroke:h})}),new ol.style.Style({stroke:g})],viewport:[new ol.style.Style({stroke:a}),new ol.style.Style({stroke:new ol.style.Stroke({color:e.white,width:1})})]}});