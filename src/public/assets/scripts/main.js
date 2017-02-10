biigle.$viewModel("volume-dashboard-hot-box-right",function(e){new Vue({el:e,components:{volumeThumbnail:biigle.$require("projects.components.volumeThumbnail")}})}),biigle.$viewModel("volume-metadata-upload",function(e){var t=biigle.$require("messages.store"),i=biigle.$require("api.volumeImageMetadata"),s=biigle.$require("volumes.id");new Vue({el:e,data:{loading:!1,csv:void 0,error:!1,success:!1,message:void 0},methods:{handleSuccess:function(){this.error=!1,this.success=!0},handleError:function(e){this.success=!1,e.data.file?Array.isArray(e.data.file)?this.error=e.data.file[0]:this.error=e.data.file:t.handleErrorResponse(e)},submit:function(e){if(this.csv){this.loading=!0;var t=new FormData;t.append("file",this.csv),i.save({id:s},t).bind(this).then(this.handleSuccess,this.handleError).finally(function(){this.loading=!1})}},setCsv:function(e){this.csv=e.target.files[0]}}})}),biigle.$viewModel("volume-container",function(e){var t=biigle.$require("volumes.imageIds"),i=biigle.$require("volumes.imageUuids"),s=biigle.$require("volumes.thumbUri"),n=biigle.$require("volumes.annotateUri"),o=biigle.$require("volumes.imageUri");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],components:{sidebar:biigle.$require("core.components.sidebar"),sidebarTab:biigle.$require("core.components.sidebarTab"),imageGrid:biigle.$require("volumes.components.volumeImageGrid"),filterTab:biigle.$require("volumes.components.filterTab")},data:{imageIds:t,images:[],filterSequence:t,sortingSequence:t,volumeId:biigle.$require("volumes.volumeId"),filterMode:null},computed:{sortedImages:function(){var e,t={};for(e=this.sortingSequence.length-1;e>=0;e--)t[this.sortingSequence[e]]=e;var i=[];for(e=this.images.length-1;e>=0;e--)i[t[this.images[e].id]]=this.images[e];return i},imagesToShow:function(){var e=this;return"flag"===this.filterMode?this.sortedImages.map(function(t){return t.flagged=e.filterSequence.indexOf(t.id)!==-1,t}):this.sortedImages.filter(function(t){return t.flagged=!1,e.filterSequence.indexOf(t.id)!==-1})},hasFilterSequence:function(){return this.imageIds.length>this.filterSequence.length}},methods:{handleSidebarToggle:function(){this.$nextTick(function(){this.$refs.imageGrid.$emit("resize")})},toggleLoading:function(e){this.loading=e},updateFilterSequence:function(e){this.filterSequence=e.sequence,this.filterMode=e.mode}},created:function(){var e=this.imageIds.map(function(e){return{id:e,url:s.replace("{uuid}",i[e]),annotateUrl:n.replace("{id}",e),imageUrl:o.replace("{id}",e),flagged:!1}});Vue.set(this,"images",e)}})}),biigle.$declare("api.volumeImageMetadata",Vue.resource("api/v1/volumes{/id}/images/metadata")),biigle.$declare("api.volumes",Vue.resource("api/v1/volumes{/id}",{},{queryImagesWithImageLabel:{method:"GET",url:"api/v1/volumes{/id}/images/filter/image-label{/label_id}"},queryImageLabels:{method:"GET",url:"api/v1/volumes{/id}/image-labels"}})),biigle.$component("volumes.components.filterListComponent",{template:'<span><strong>with<span v-if="rule.negate">out</span></strong> <span v-text="name"></span> <strong v-if="rule.data" v-text="rule.data.name"></strong></span>',props:{rule:{type:Object,required:!0}},data:function(){return{name:this.rule.id}}}),biigle.$component("volumes.components.filterSelectComponent",{template:'<div class="filter-select"><typeahead :items="items" :value="value" :placeholder="placeholder" @select="select"></typeahead><button type="submit" class="btn btn-default" @click="submit" :disabled="!selectedItem">Add rule</button></div>',components:{typeahead:biigle.$require("core.components.typeahead")},props:{volumeId:{type:Number,required:!0}},data:function(){return{items:[],placeholder:"",selectedItem:null}},computed:{value:function(){return this.selectedItem?this.selectedItem.name:""}},methods:{select:function(e){this.selectedItem=e},gotItems:function(e){this.items=e.data},submit:function(){this.$emit("select",this.selectedItem)}}}),biigle.$component("volumes.components.filterTab",{mixins:[biigle.$require("core.mixins.loader")],props:{volumeId:{type:Number,required:!0},imageIds:{type:Array,required:!0}},data:function(){return{filters:biigle.$require("volumes.stores.filters"),rules:[],selectedFilterId:null,negate:!1,mode:"filter"}},computed:{selectedFilter:function(){for(var e=this.filters.length-1;e>=0;e--)if(this.filters[e].id===this.selectedFilterId)return this.filters[e];return null},hasSelectComponent:function(){return this.selectedFilter&&this.selectedFilter.selectComponent},selectComponent:function(){return this.selectedFilter.id+"Select"},hasRules:function(){return this.rules.length>0},sequence:function(){for(var e=[],t=[],i=this.rules.length-1;i>=0;i--)this.rules[i].negate?Array.prototype.push.apply(t,this.rules[i].sequence):Array.prototype.push.apply(e,this.rules[i].sequence);var s;return s=e.length>0?e.filter(function(e,t,i){return i.indexOf(e)===t}):this.imageIds,s.filter(function(e){return t.indexOf(e)===-1})},inFilterMode:function(){return"filter"===this.mode},inFlagMode:function(){return"flag"===this.mode}},methods:{filterValid:function(e){return"string"==typeof e.id&&"string"==typeof e.label&&"object"==typeof e.listComponent&&"function"==typeof e.getSequence},hasRule:function(e){return this.rules.findIndex(function(t){return t.id===e.id&&t.negate===e.negate&&t.data===e.data})!==-1},addRule:function(e){if(this.selectedFilter){var t={id:this.selectedFilter.id,data:e,negate:this.negate};if(!this.hasRule(t)){this.startLoading();var i=this;this.selectedFilter.getSequence(this.volumeId,e).catch(biigle.$require("messages.store").handleErrorResponse).then(function(e){i.ruleAdded(t,e)}).finally(this.finishLoading)}}},ruleAdded:function(e,t){e.sequence=t.data,this.rules.push(e)},removeRule:function(e){this.rules.splice(e,1)},reset:function(){this.rules=[],this.selectedFilterId=null,this.negate=!1,this.mode="filter"},activateFilterMode:function(){this.mode="filter"},activateFlagMode:function(){this.mode="flag"},emitUpdate:function(){this.$emit("update",{sequence:this.sequence,mode:this.mode})}},watch:{sequence:function(){this.emitUpdate()},mode:function(){this.emitUpdate()}},created:function(){for(var e,t=0;t<this.filters.length;t++)e=this.filters[t],this.filterValid(e)||(console.error("Filter "+e.id+" invalid. Ignoring..."),this.filters.splice(t,1)),this.$options.components[e.id+"List"]=e.listComponent,e.selectComponent&&(this.$options.components[e.id+"Select"]=e.selectComponent)}}),biigle.$component("volumes.components.imageGrid",{template:'<div class="image-grid" @wheel.prevent="scroll"><div class="image-grid__images" ref="images"><image-grid-image v-for="image in displayedImages" :key="image.id" :image="image" :empty-url="emptyUrl" @select="emitSelect" @deselect="emitDeselect"></image-grid-image></div><image-grid-progress :progress="progress" @top="jumpToStart" @prev-page="reversePage" @prev-row="reverseRow" @jump="jumpToPercent" @next-row="advanceRow" @next-page="advancePage" @bottom="jumpToEnd"></image-grid-progress></div>',data:function(){return{clientWidth:0,clientHeight:0,privateOffset:0}},components:{imageGridImage:biigle.$require("volumes.components.imageGridImage"),imageGridProgress:biigle.$require("volumes.components.imageGridProgress")},props:{images:{type:Array,required:!0},emptyUrl:{type:String,required:!0},width:{type:Number,default:135},height:{type:Number,default:180},margin:{type:Number,default:8}},computed:{columns:function(){return Math.floor(this.clientWidth/(this.width+this.margin))},rows:function(){return Math.floor(this.clientHeight/(this.height+this.margin))},displayedImages:function(){return this.images.slice(this.offset,this.offset+this.columns*this.rows)},offset:{get:function(){return this.privateOffset},set:function(e){this.privateOffset=Math.max(0,Math.min(this.lastRow*this.columns,e))}},progress:function(){return this.offset/(this.columns*this.lastRow)},lastRow:function(){return Math.ceil(this.images.length/this.columns)-this.rows}},methods:{updateDimensions:function(){this.clientHeight=this.$refs.images.clientHeight,this.clientWidth=this.$refs.images.clientWidth,this.offset=this.offset},scrollRows:function(e){this.offset=this.offset+this.columns*e},scroll:function(e){this.scrollRows(e.deltaY>=0?1:-1)},advanceRow:function(){this.scrollRows(1)},advancePage:function(){this.scrollRows(this.rows)},reverseRow:function(){this.scrollRows(-1)},reversePage:function(){this.scrollRows(-this.rows)},jumpToPercent:function(e){this.offset=this.columns*Math.round(this.lastRow*e)},jumpToStart:function(){this.jumpToPercent(0)},jumpToEnd:function(){this.jumpToPercent(1)},emitSelect:function(e){this.$emit("select",e)},emitDeselect:function(e){this.$emit("deselect",e)}},watch:{images:function(){this.offset=this.offset}},created:function(){window.addEventListener("resize",this.updateDimensions),this.$on("resize",this.updateDimensions);var e=biigle.$require("labelTrees.stores.keyboard");e.on(38,this.reverseRow),e.on(40,this.advanceRow),e.on(37,this.reversePage),e.on(33,this.reversePage),e.on(39,this.advancePage),e.on(34,this.advancePage),e.on(36,this.jumpToStart),e.on(35,this.jumpToEnd)},mounted:function(){this.$nextTick(this.updateDimensions)}}),biigle.$component("volumes.components.imageGridImage",{template:'<figure class="image-grid__image" :class="classObject"><img @click="toggleSelect" :src="url || emptyUrl" @error="showEmptyImage"></figure>',data:function(){return{url:"",timeout:null}},props:{image:{type:Object,required:!0},emptyUrl:{type:String,required:!0}},computed:{classObject:function(){return{"image-grid__image--selected":this.selected}},selected:function(){return!1}},methods:{toggleSelect:function(){this.selected?this.$emit("deselect",this.image):this.$emit("select",this.image)},gotBlob:function(e){var t=window.URL||window.webkitURL;this.url=t.createObjectURL(e.body),this.image.blob=this.url},showEmptyImage:function(){this.url=this.emptyUrl}},created:function(){if(this.image.url)this.url=this.image.url;else if(this.image.blob)this.url=this.image.blob;else if(this.getUrl)this.url=this.getUrl();else if(this.getBlob){var e=this;this.timeout=setTimeout(function(){e.getBlob().then(e.gotBlob)},50)}},beforeDestroy:function(){clearTimeout(this.timeout)}}),biigle.$component("volumes.components.imageGridProgress",{template:'<div class="image-grid-progress"><div class="btn-group-vertical"><button type="button" class="btn btn-default btn-xs" title="Go to top 𝗛𝗼𝗺𝗲" @click="top" :disabled="isAtTop"><span class="glyphicon glyphicon-fast-backward"></span></button><button type="button" class="btn btn-default btn-xs" title="Previous page 𝗣𝗮𝗴𝗲 𝘂𝗽/𝗔𝗿𝗿𝗼𝘄 𝗹𝗲𝗳𝘁" @click="prevPage" :disabled="isAtTop"><span class="glyphicon glyphicon-step-backward"></span></button><button type="button" class="btn btn-default btn-xs" title="Previous row 𝗔𝗿𝗿𝗼𝘄 𝘂𝗽" @click="prevRow" :disabled="isAtTop"><span class="glyphicon glyphicon-triangle-left"></span></button></div><div class="image-grid-progress__bar" @mousedown="beginScrolling" @mouseup="stopScrolling" @mouseleave="stopScrolling" @mousemove.prevent="scroll" @click="jump"><div class="image-grid-progress__wrapper"><div class="image-grid-progress__inner" :style="{height: progressHeight}"></div></div></div><div class="btn-group-vertical"><button type="button" class="btn btn-default btn-xs" title="Next row 𝗔𝗿𝗿𝗼𝘄 𝗱𝗼𝘄𝗻" @click="nextRow" :disabled="isAtBottom"><span class="glyphicon glyphicon-triangle-right"></span></button><button type="button" class="btn btn-default btn-xs" title="Next page 𝗣𝗮𝗴𝗲 𝗱𝗼𝘄𝗻/𝗔𝗿𝗿𝗼𝘄 𝗿𝗶𝗴𝗵𝘁" @click="nextPage" :disabled="isAtBottom"><span class="glyphicon glyphicon-step-forward"></span></button><button type="button" class="btn btn-default btn-xs" title="Go to bottom 𝗘𝗻𝗱" @click="bottom" :disabled="isAtBottom"><span class="glyphicon glyphicon-fast-forward"></span></button></div></div>',data:function(){return{scrolling:!1}},props:{progress:{type:Number,required:!0}},computed:{isAtTop:function(){return 0===this.progress},isAtBottom:function(){return 1===this.progress},progressHeight:function(){return 100*this.progress+"%"}},methods:{top:function(){this.$emit("top")},prevPage:function(){this.$emit("prev-page")},prevRow:function(){this.$emit("prev-row")},beginScrolling:function(){this.scrolling=!0},stopScrolling:function(){this.scrolling=!1},scroll:function(e){this.scrolling&&this.jump(e)},jump:function(e){var t=e.target.getBoundingClientRect();this.$emit("jump",(e.clientY-t.top)/t.height)},nextRow:function(){this.$emit("next-row")},nextPage:function(){this.$emit("next-page")},bottom:function(){this.$emit("bottom")}}}),biigle.$component("volumes.components.volumeImageGrid",{mixins:[biigle.$require("volumes.components.imageGrid")],components:{imageGridImage:biigle.$require("volumes.components.volumeImageGridImage")}}),biigle.$component("volumes.components.volumeImageGridImage",{mixins:[biigle.$require("volumes.components.imageGridImage")],template:'<figure class="image-grid__image image-grid__image--volume" :class="classObject"><a v-if="image.annotateUrl" :href="image.annotateUrl"><img @click="toggleSelect" :src="url || emptyUrl" @error="showEmptyImage"></a><img v-else @click="toggleSelect" :src="url || emptyUrl" @error="showEmptyImage"><div class="image-buttons"><a v-if="image.imageUrl" :href="image.imageUrl" class="image-button" title="Viev image information"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></a></div></figure>',computed:{showAnnotationLink:function(){var e=biigle.$require("largo.showAnnotationRoute");return e?e+this.image.id:""},selected:function(){return this.image.flagged}}}),biigle.$declare("volumes.stores.filters",[{id:"imageLabel",label:"image label",listComponent:{mixins:[biigle.$require("volumes.components.filterListComponent")],data:function(){return{name:"image label"}}},selectComponent:{mixins:[biigle.$require("volumes.components.filterSelectComponent")],data:function(){return{placeholder:"Label name"}},created:function(){biigle.$require("api.volumes").queryImageLabels({id:this.volumeId}).then(this.gotItems,biigle.$require("messages.store").handleErrorResponse)}},getSequence:function(e,t){return biigle.$require("api.volumes").queryImagesWithImageLabel({id:e,label_id:t.id})}}]);