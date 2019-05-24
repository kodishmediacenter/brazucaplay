;(function($,_,undefined){"use strict";ips.controller.register('forums.front.forum.flow',{_ids:[],_button:null,initialize:function(){this.on('click','[data-node-id]',this.toggleFilters);this.setup();},setup:function(){var _ids=ips.utils.url.getParam('forumId');var self=this;if(!_.isUndefined(_ids)){this._ids=decodeURIComponent(_ids).split(',');}else if(!_.isUndefined(ips.utils.cookie.get('forums_flowIds'))){this._ids=ips.utils.cookie.get('forums_flowIds').split(',');}
if(_.isObject(this._ids)&&_.size(this._ids)){_.each(this._ids,function(val,key){if(val){self.childSelect(val,true);}});}
this._button=$('body').find('[data-role="fluidForumMobileDesc"]');this._updateButtonText();},toggleFilters:function(e){e.preventDefault();var link=$(e.currentTarget);var id=link.attr('data-node-id');var parentId=link.attr('data-parent-id');var hasChildren=link.attr('data-has-children');if(_.indexOf(this._ids,id)==-1){this.childSelect(id,false);}else{this.childUnselect(id);}
this._updateButtonText();$(document).trigger('updateTableURL',{forumId:_.uniq(_.values(this._ids)).join(',')});},isSelected:function(id){return this.scope.find('[data-node-id="'+id+'"]').hasClass('cForumMiniList_selected')?true:false;},childSelect:function(id,skipChildren){Debug.log("Select child: "+id);this._ids.push(id);var node=this.scope.find('[data-node-id="'+id+'"]');node.addClass('cForumMiniList_selected');var parentId=node.attr('data-parent-id');if(skipChildren===false&&(node.attr('data-has-children')||id==parentId)){var self=this;_.each(this.scope.find('[data-parent-id="'+id+'"]'),function(v,k){var _cId=$(v).attr('data-node-id');if(_cId!=id){self.childSelect(_cId,false);}});}
this.updateCookie();},childUnselect:function(id){Debug.log("UNselect child: "+id);this.scope.find('[data-node-id="'+id+'"]').removeClass('cForumMiniList_selected');this._ids=_.without(this._ids,id);this.updateCookie();var self=this;_.each(this.scope.find('[data-parent-id="'+id+'"]'),function(v,k){var _cId=$(v).attr('data-node-id');if(_cId!=id){self.childUnselect(_cId);}});this.parentUnselect(this.scope.find('[data-node-id="'+id+'"]').closest('[data-category]').find('[data-node-id]').first().attr('data-node-id'));},parentSelect:function(parentId){Debug.log("Select parent: "+parentId);this.scope.find('[data-node-id="'+parentId+'"]').addClass('cForumMiniList_selected');var self=this;_.each(this.scope.find('[data-parent-id="'+parentId+'"]'),function(v,k){var _cId=$(v).attr('data-node-id');if(_cId!=parentId){self.childUnselect(_cId);}});},parentUnselect:function(parentId){Debug.log("UNselect parent: "+parentId);var node=this.scope.find('[data-node-id="'+parentId+'"]');node.removeClass('cForumMiniList_selected');this._ids=_.without(this._ids,parentId);this.updateCookie();Debug.log("Looking for parent ID "+node.attr('data-parent-id'));var self=this;_.each(this.scope.find('[data-node-id="'+node.attr('data-parent-id')+'"]'),function(v,k){var _cId=$(v).attr('data-node-id');if(_cId!=parentId){Debug.log("Found "+_cId);self.parentUnselect(_cId);}});},updateCookie:function(id){var cookie=_.uniq(_.values(this._ids)).join(',');Debug.log("Updating cookie: "+cookie);ips.utils.cookie.set('forums_flowIds',cookie,true);},_updateButtonText:function(){var blobs=this.scope.find('.cForumMiniList_blob');var selectedBlobRows=blobs.filter(function(){if($(this).closest('.cForumMiniList_selected').length){return true;}
return false;});var text='';if(blobs.length==selectedBlobRows.length||selectedBlobRows.length===0){text=ips.getString('topicsFromAllForums');}else{text=ips.pluralize(ips.getString('topicsFromXForums'),selectedBlobRows.length);}
this._button.text(text);}});}(jQuery,_));;
;(function($,_,undefined){"use strict";ips.controller.register('forums.front.forum.forumList',{initialize:function(){this.on('click','[data-action="toggleCategory"]',this.toggleCategory);this.setup();},setup:function(){var self=this;var hiddenCategories=ips.utils.db.get('hiddenCategories');if(_.isObject(hiddenCategories)&&_.size(hiddenCategories)){_.each(hiddenCategories,function(val,key){self.scope.find('[data-categoryID="'+key+'"]').addClass('cForumRow_hidden').attr('data-hidden',true).find('[data-role="forums"]').hide();});}},toggleCategory:function(e){e.preventDefault();var category=$(e.currentTarget).closest('[data-categoryID]');if(!category.attr('data-hidden')){ips.utils.db.set('hiddenCategories',category.attr('data-categoryID'),true);category.addClass('cForumRow_hidden').attr('data-hidden',true).find('[data-role="forums"]').hide();}else{ips.utils.anim.go('fadeIn',category.find('[data-role="forums"]'));ips.utils.db.remove('hiddenCategories',category.attr('data-categoryID'));category.removeClass('cForumRow_hidden').removeAttr('data-hidden');}}});}(jQuery,_));;
;(function($,_,undefined){"use strict";ips.controller.register('forums.front.forum.forumPage',{initialize:function(){this.on('click','[data-action="markForumRead"]',this.markForumRead);},markForumRead:function(e){e.preventDefault();var self=this;ips.ui.alert.show({type:'confirm',icon:'question',message:ips.getString('markForumAsReadConfirm'),subText:'',callbacks:{ok:function(){var url=$(e.currentTarget).attr('href');ips.getAjax()(url,{showLoading:true,bypassRedirect:true}).done(function(){self.triggerOn('core.global.core.table','markTableRead');ips.utils.anim.go('fadeOut',$(e.currentTarget));ips.ui.flashMsg.show(ips.getString('forumMarkedRead'));}).fail(function(jqXHR,textStatus,errorThrown){window.location=url;});}}});}});}(jQuery,_));;
;(function($,_,undefined){"use strict";ips.controller.register('forums.front.forum.hovercard',{initialize:function(){this.on('click','[data-action="markTopicRead"]',this.markTopicRead);},markTopicRead:function(e){e.preventDefault();if($(e.currentTarget).attr('data-disabled')){return;}
this.trigger('markTableRowRead',{tableID:'topics',rowID:this.scope.attr('data-topicID')});ips.ui.flashMsg.show(ips.getString('topicMarkedRead'));ips.getAjax()($(e.currentTarget).attr('href'),{bypassRedirect:true});$(e.currentTarget).addClass('ipsFaded').attr('data-disabled');}});}(jQuery,_));;