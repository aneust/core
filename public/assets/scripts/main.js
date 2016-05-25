angular.module("dias.api",["ngResource"]),angular.module("dias.api").config(["$httpProvider","$compileProvider",function(e,t){"use strict";e.defaults.headers.common["X-Requested-With"]="XMLHttpRequest",t.debugInfoEnabled(!1)}]),angular.module("dias.ui.messages",["ui.bootstrap"]),angular.module("dias.ui.messages").config(["$compileProvider",function(e){e.debugInfoEnabled(!1)}]),angular.element(document).ready(function(){"use strict";angular.bootstrap(document.querySelector('[data-ng-controller="MessagesController"]'),["dias.ui.messages"])}),angular.module("dias.ui.users",["ui.bootstrap","dias.api"]),angular.module("dias.ui.users").config(["$compileProvider",function(e){"use strict";e.debugInfoEnabled(!1)}]),angular.module("dias.ui.utils",[]),angular.module("dias.ui.utils").config(["$compileProvider","$locationProvider",function(e,t){"use strict";e.debugInfoEnabled(!1),t.html5Mode({enabled:!0,requireBase:!1,rewriteLinks:!1})}]),angular.module("dias.ui",["ui.bootstrap","dias.ui.messages","dias.ui.users","dias.ui.utils","ngAnimate"]),angular.module("dias.ui").config(["$compileProvider",function(e){"use strict";e.debugInfoEnabled(!1)}]),angular.module("dias.api").factory("Annotation",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/annotations/:id",{id:"@id"},{save:{method:"PUT"},query:{method:"GET",url:t+"/api/v1/images/:id/annotations",isArray:!0},add:{method:"POST",url:t+"/api/v1/images/:id/annotations"}})}]),angular.module("dias.api").factory("AnnotationLabel",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/annotation-labels/:id",{id:"@id",annotation_id:"@annotation_id"},{query:{method:"GET",url:t+"/api/v1/annotations/:annotation_id/labels",isArray:!0},attach:{method:"POST",url:t+"/api/v1/annotations/:annotation_id/labels"},save:{method:"PUT",params:{annotation_id:null}},"delete":{method:"DELETE",params:{annotation_id:null}}})}]),angular.module("dias.api").factory("Image",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/images/:id",{id:"@id"})}]),angular.module("dias.api").factory("Label",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/labels/:id",{id:"@id"},{add:{method:"POST"},save:{method:"PUT"}})}]),angular.module("dias.api").factory("MediaType",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/media-types/:id",{id:"@id"})}]),angular.module("dias.api").factory("OwnUser",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/users/my",{},{save:{method:"PUT"}})}]),angular.module("dias.api").factory("Project",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/projects/:id",{id:"@id"},{query:{method:"GET",params:{id:"my"},isArray:!0},add:{method:"POST"},save:{method:"PUT"}})}]),angular.module("dias.api").factory("ProjectLabel",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/projects/:project_id/labels",{project_id:"@project_id"})}]),angular.module("dias.api").factory("ProjectTransect",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/projects/:project_id/transects/:id",{id:"@id"},{add:{method:"POST"},attach:{method:"POST"},detach:{method:"DELETE"}})}]),angular.module("dias.api").factory("ProjectUser",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/projects/:project_id/users/:id",{id:"@id"},{save:{method:"PUT"},attach:{method:"POST"},detach:{method:"DELETE"}})}]),angular.module("dias.api").factory("Role",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/roles/:id",{id:"@id"})}]),angular.module("dias.api").factory("Shape",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/shapes/:id",{id:"@id"})}]),angular.module("dias.api").factory("Transect",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/transects/:id",{id:"@id"},{save:{method:"PUT"}})}]),angular.module("dias.api").factory("TransectImage",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/transects/:transect_id/images",{},{save:{method:"POST",isArray:!0}})}]),angular.module("dias.api").factory("User",["$resource","URL",function(e,t){"use strict";return e(t+"/api/v1/users/:id/:query",{id:"@id"},{save:{method:"PUT"},add:{method:"POST"},find:{method:"GET",params:{id:"find"},isArray:!0}})}]),angular.module("dias.api").service("roles",["Role",function(e){"use strict";var t={},i={};e.query(function(e){e.forEach(function(e){t[e.id]=e.name,i[e.name]=e.id})}),this.getName=function(e){return t[e]},this.getId=function(e){return i[e]}}]),angular.module("dias.api").service("shapes",["Shape",function(e){"use strict";var t={},i={},a=e.query(function(e){e.forEach(function(e){t[e.id]=e.name,i[e.name]=e.id})});this.getName=function(e){return t[e]},this.getId=function(e){return i[e]},this.getAll=function(){return a}}]),angular.module("dias.ui.messages").constant("MAX_MSG",1),angular.module("dias.ui.messages").controller("MessagesController",["$scope","MAX_MSG",function(e,t){"use strict";e.alerts=[];var i=function(){document.exitFullscreen?document.exitFullscreen():document.msExitFullscreen?document.msExitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()};window.$diasPostMessage=function(a,r){i(),e.$apply(function(){e.alerts.unshift({message:r,type:a||"info"}),e.alerts.length>t&&e.alerts.pop()})},e.close=function(t){e.alerts.splice(t,1)}}]),angular.module("dias.ui.messages").service("msg",function(){"use strict";var e=this;this.post=function(e,t){t=t||e,window.$diasPostMessage(e,t)},this.danger=function(t){e.post("danger",t)},this.warning=function(t){e.post("warning",t)},this.success=function(t){e.post("success",t)},this.info=function(t){e.post("info",t)},this.responseError=function(t){var i=t.data;if(i)if(i.message)e.danger(i.message);else if(401===t.status)e.danger("Please log in (again).");else if("string"==typeof i)e.danger(i);else for(var a in i)e.danger(i[a][0]);else e.danger("The server didn't respond, sorry.")}}),angular.module("dias.ui.utils").factory("debounce",["$timeout","$q",function(e,t){"use strict";var i={};return function(a,r,n){var s=t.defer();return function(){var o=this,u=arguments,d=function(){i[n]=void 0,s.resolve(a.apply(o,u)),s=t.defer()};return i[n]&&e.cancel(i[n]),i[n]=e(d,r),s.promise}()}}]),angular.module("dias.ui.utils").factory("filterExclude",function(){"use strict";var e=function(e,t){return e-t},t=function(t,i,a){a||(i=i.slice(0).sort(e));for(var r=t.slice(0).sort(e),n=0,s=0;n<i.length&&s<r.length;)i[n]<r[s]?n++:i[n]===r[s]?(t.splice(t.indexOf(r[s]),1),n++,s++):s++};return t}),angular.module("dias.ui.utils").factory("filterSubset",function(){"use strict";var e=function(e,t){return e-t},t=function(t,i,a){a||(i=i.slice(0).sort(e));for(var r=t.slice(0).sort(e),n=[],s=0,o=0;s<i.length&&o<r.length;)i[s]<r[o]?s++:i[s]===r[o]?(s++,o++):n.push(r[o++]);for(;o<r.length;)n.push(r[o++]);for(s=0;s<n.length;s++)t.splice(t.indexOf(n[s]),1)};return t}),angular.module("dias.ui.users").directive("userChooser",function(){"use strict";return{restrict:"A",scope:{select:"=userChooser"},replace:!0,template:'<input type="text" data-ng-model="selected" data-uib-typeahead="name(user) for user in find($viewValue)" data-typeahead-wait-ms="250" data-typeahead-on-select="select($item)"/>',controller:["$scope","User",function(e,t){e.name=function(e){return e&&e.firstname&&e.lastname?e.firstname+" "+e.lastname:""},e.find=function(e){return t.find({query:encodeURIComponent(e)}).$promise}}]}}),angular.module("dias.ui.utils").service("keyboard",function(){"use strict";var e={},t=function(e,t){for(var i=e.length-1;i>=0;i--)if(e[i].callback(t)===!1)return},i=function(i){var a=i.keyCode,r=String.fromCharCode(i.which||a).toLowerCase();e[a]&&t(e[a],i),e[r]&&t(e[r],i)};document.addEventListener("keydown",i),this.on=function(t,i,a){("string"==typeof t||t instanceof String)&&(t=t.toLowerCase()),a=a||0;var r={callback:i,priority:a};if(e[t]){var n,s=e[t];for(n=0;n<s.length&&!(s[n].priority>=a);n++);n===s.length-1?s.push(r):s.splice(n,0,r)}else e[t]=[r]},this.off=function(t,i){if(("string"==typeof t||t instanceof String)&&(t=t.toLowerCase()),e[t])for(var a=e[t],r=0;r<a.length;r++)if(a[r].callback===i){a.splice(r,1);break}}}),angular.module("dias.ui.utils").service("urlParams",["$location",function(e){"use strict";this.setSlug=function(t){var i=e.path();i=i.substring(0,i.lastIndexOf("/")),e.path(i+"/"+t),e.replace()},this.set=function(t){e.search(t),e.replace()},this.unset=function(t){e.search(t,null)},this.get=function(t){return e.search()[t]}}]);