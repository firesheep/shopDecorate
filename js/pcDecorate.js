$(function(){
jQuery.urlParam = function(name){
    var result = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
    return decodeURIComponent(result);
}
var merchant_user_id = $.urlParam('_merchant_user_id_'),
    shopUserId = $.urlParam('q_sellerUserId');

var ajaxUrl = {
	businessType:"//enterprise.qbao.com/merchantUser/toShopFinishNew.html",
    getShopInfo:"//enterprise.qbao.com/merchant/shop/qry/getShopFrontPageInfo.html",
    upload:"//enterprise.qbao.com/qiniu/image/upload.html",
    coverBusi:"//enterprise.qbao.com/company/merchant/shop/cover/update.html",  //企业商家封面更新
    coverIndividual:"//enterprise.qbao.com/cooperatorShop/decoration/updateShopImg.html",   //个人商家封面更新
	merchantUpdate:"//enterprise.qbao.com/company/merchant/shop/logo/update.html",	//企业商家图片更新
	updateShopImg:"//enterprise.qbao.com/cooperatorShop/decoration/updateShopImg.html",	//个人商家图片更新
	getShopLogoApply:"//enterprise.qbao.com/cooperatorShop/decoration/getShopLogoApply.html",	//个人商家logo审核状态
	getMerchantHaveTag:"//enterprise.qbao.com/merchant/shop/qry/getMerchantHaveTag.html",
    getSwitch:"//enterprise.qbao.com/merchant/shop/qry/getProductsCategoryV2.html",     //查询商品分类展示状态
	switchProductsCategory:"//enterprise.qbao.com/merchant/shop/qry/switchProductsCategory.html",	//设置商品分类展示状态
    updateBatch:"//enterprise.qbao.com/company/merchant/banner/updateBatch.html",   //企业商家banner保存
    updateShopBannerBatch:"//enterprise.qbao.com/cooperatorShop/decoration/updateShopBannerBatch.html", //个人商家banner保存
    bannerDel:"//enterprise.qbao.com/company/merchant/banner/remove.html",  //企业商家banner删除
    delBanner:"/cooperatorShop/decoration/removeBanner.html",   //个人商家banner删除
	getShowGoodsList:"//goods.qbao.com/goodsWeb/getShowGoodsList.html",
	goodsClassify:"//goods.qbao.com/storeCatalog/loadList.html",
	setShowWindowGoods:"//goods.qbao.com/goodsWeb/setShowWindowGoods.html",
	getShowWindowGoods:"//goods.qbao.com/goodsWeb/getShowWindowGoods.html",
    deleteShowWindowGoods:"//goods.qbao.com/goodsWeb/deleteShowWindowGoods.html",
    publicSave:"//enterprise.qbao.com/merchant/shop/shopConfig/editBusiShopConfigEles.html",    //对应模块保存元素
    publicGet:"//enterprise.qbao.com/merchant/shop/shopConfig/getBusiShopConfigEles.html",  //对应模块查询元素
    publicGetAll:"//enterprise.qbao.com/merchant/shop/shopConfig/getBusiShopConfigElesList.html",
    comGoodsDetail:"//goods.qbao.com/goodsWeb/spu/list.html",
    sellingGoods:"//enterprise.qbao.com/merchant/shop/qry/searchProducts.html",
    submit:"//enterprise.qbao.com//merchant/shop/shopConfig/saveShopConfig.html",
    decorateData:"//enterprise.qbao.com/merchant/shop/shopConfig/getCurrentShopConfig.html",
}	

$(".mainTab").on("click","p",function(){
    $(this).addClass("tabActive");
    $(this).siblings("p").removeClass('tabActive');
    $(".tabChoose").css({
        'left':( $(this).index()==0?"540px":"640px" )
    })
    if ( $(this).index() == 2 ) {
        var modualId = '';
        if ( $('.banner').attr("id") != undefined ) {
            modualId = $('.banner').attr("id")+',';
        }
        for( var i=0;i<$(".gridly").find(".column").length;i++ ){
            modualId += $(".gridly").find(".column").eq(i).attr("id")+",";
        }
        localStorage.setItem('pcModualId',modualId);
    	window.location.href = '//enterprise.qbao.com/shopDecorate/appDecorate.htm?shopUserId='+shopUserId+'&_merchant_user_id_='+merchant_user_id;
    }
})

$.ajax({    //区分个人商家及企业商家
    url: ajaxUrl.businessType,
    type: "POST",
    dataType: "json",
    success: function(data){
        if ( data.success ) {
            $(".businessType").text(data.data);
        }else{
            errorTip( data.message )
        }
    },
    error: function(xhr, type){
    }
});

var pdObj = {
    setDecorate:function(){
        var postData = {
            'type': '1',
        }
        $.ajax({
            url: ajaxUrl.decorateData,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    if ( data.data == null ) {
                        return;
                    }
                    var data = JSON.parse(data.data.data).pcModualId.split(","),arrCommodity = [],
                        numWin = 0,numCommodity = 0,numSelling = 0,numBanner = 0,numCustomPic = 0;
                    for( var i=0;i<data.length;i++ ){
                        if ( data[i].substring(0,1) == "1" ) { //橱窗推荐
                            var str = '';
                            numWin++;
                            str = '<div class="galleryFeatured column" id="1-1">'+
                                    '<div class="columnTit">'+
                                        '<span>橱窗推荐</span>'+
                                    '</div>'+
                                    '<div class="colunmMain windowMain">'+
                                        '<ul>'+
                                            '<img src="/shopDecorate/images/gfPic.jpg">'+
                                        '</ul>'+
                                    '</div>'+
                                    '<div class="move">'+
                                        '<div class="up"><img src="/shopDecorate/images/upPic.png"></div>'+
                                        '<div class="down"><img src="/shopDecorate/images/downPic.png"></div>'+
                                    '</div>'+
                                    '<div class="del">删除</div>'+
                                    '<div class="edit d">编辑</div>'+
                                '</div>';
                            $(".gridly").append( str );
                            $(".leftWindow").find('.listNum span').text( numWin );
                            pdObj.getWindowGoods();
                        }else if ( data[i].substring(0,1) == "2" ) {   //商品推荐
                            var str = '';
                            numCommodity++;
                            str = '<div class="commodity column" id="'+ data[i] +'">'+
                                    '<div class="columnTit">'+
                                        '<span>商品推荐</span>'+
                                    '</div>'+
                                    '<div class="colunmMain commodityMain">'+
                                        '<ul>'+
                                            '<img src="/shopDecorate/images/commodityPic.jpg">'+
                                        '</ul>'+
                                    '</div>'+
                                    '<div class="move">'+
                                        '<div class="up"><img src="/shopDecorate/images/upPic.png"></div>'+
                                        '<div class="down"><img src="/shopDecorate/images/downPic.png"></div>'+
                                    '</div>'+
                                    '<div class="del">删除</div>'+
                                '<div class="edit e">编辑</div>'+
                                '</div>';
                            $(".gridly").append( str );
                            
                            $(".addCommodity").attr("comModuleId", $(".addCommodity").attr("comModuleId")+"2-"+(numCommodity)+"," );
                            $(".leftCom").find('.listNum span').text( numCommodity );
                            pdObj.comGoodsGetFn(data[i]);
                            
                        }else if ( data[i].substring(0,1) == "3" ) {   //热销商品
                            var str = '';
                            numSelling++;
                            str = '<div class="selling column" id="3-1">'+
                                '<div class="columnTit">'+
                                    '<span>热销商品</span>'+
                                '</div>'+
                                '<div class="colunmMain sellingMain">'+
                                    '<ul>'+
                                        '<img src="/shopDecorate/images/commodityPic.jpg">'+
                                    '</ul>'+
                                '</div>'+
                                '<div class="move" style="right: 60px;">'+
                                    '<div class="up"><img src="/shopDecorate/images/upPic.png"></div>'+
                                    '<div class="down"><img src="/shopDecorate/images/downPic.png"></div>'+
                                '</div>'+
                                '<div class="del" style="right: 2px;">删除</div>'+
                            '</div>';
                            $(".gridly").append( str );
                            pdObj.getSellingGoods();
                            $(".leftSelling").find('.listNum span').text( numSelling );
                        }else if ( data[i].substring(0,1) == "4" ) {     //banner
                            var str = '';
                            numBanner++;
                            str = '<div class="banner" id="4-1">'+
                                    '<div class="banner-container">'+
                                        '<div class="swiper-wrapper banner-wrapper">'+
                                            '<div class="swiper-slide"><img class="scroll-img" src="/shopDecorate/images/defaultBanner.jpg"></div>'+
                                        '</div>'+
                                        '<div class="swiper-pagination"></div>'+
                                    '</div>'+
                                    '<div class="del">删除</div>'+
                                    '<div class="edit c">编辑</div>'+
                                '</div>';
                            $(str).insertAfter(".comClassify");
                            $(".leftBanner").find('.listNum span').text( numBanner );
                            pdObj.getShopData();
                        }else if ( data[i].substring(0,1) == "5" ) {  //自定义图片
                            var str = '';
                            numCustomPic++;
                            str = '<div class="customAd column" id="'+ data[i] +'">'+
                                    '<div class="colunmMain cusMain">'+
                                        '<img src="/shopDecorate/images/customAdPic.jpg">'+
                                    '</div>'+
                                    '<div class="move">'+
                                        '<div class="up"><img src="/shopDecorate/images/upPic.png"></div>'+
                                        '<div class="down"><img src="/shopDecorate/images/downPic.png"></div>'+
                                    '</div>'+
                                    '<div class="del">删除</div>'+
                                    '<div class="edit h">编辑</div>'+
                                '</div>';
                            $(".gridly").append( str );
                            $(".addCustomPic").attr("cusModuleId", $(".addCustomPic").attr("cusModuleId")+"5-"+(numCustomPic)+"," );
                            $(".addCustomPic").find('.listNum span').text( numCustomPic );
                            pdObj.customPicGet( lengthReduce($(".addCustomPic").attr('cusmoduleid')) );
                        }
                    }
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
	getShopData: function(){
		var postData = {
            'display': '1',
            'shopUserId': shopUserId,
        }
        $.ajax({
            url: ajaxUrl.getShopInfo,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    pdObj.setShop(data.data);
                    $(".fsfalse").attr('fsfalse', data.data.falseOnePenaltyTen == 1);
                    $(".rzfalse").attr('rzfalse', data.data.certifyType == 1);

                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
	},
	setShop:function(data){
		$(".shopName").text( data.shopName );
		$(".sisA").css("display", ( data.certifyType == '1'?"inline-block":"none" ));
        if( data.merchantType == 2 ){            // 商家类型  2企业商家
            $(".sisB").html("企业");
        }else{
            $(".sisB").html("个人");
        }
		$(".sisC").css("display", ( data.merchantDistStatus == '1'?"inline-block":"none" ));
		$(".thumbsNum span").text( data.thumbsCount );

        //banner
        var bannerData = data.displayBanners,str = '';
        $(".shopPic img").attr("src", data.logo);
        $(".shopSign img").attr("src", data.cover);
        editBannerDialogFn(bannerData);
        for( var i=0;i<bannerData.length;i++ ){
            str += '<div class="swiper-slide"><img class="scroll-img" src="'+ bannerData[i].imgPath +'"></div>'
        }
        $('.banner-container .banner-wrapper').empty().append(str);
        var swiper = new Swiper('.banner-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 30,
                centeredSlides: true,
                // autoplay: 6000,
                autoplayDisableOnInteraction: false,
                loop:true,
                observer:true,  //修改swiper自己或子元素时，自动初始化swiper
                observeParents:true
        });
	},
	getTag:function(){
		var postData = {
            'shopUserId': shopUserId,
        }
        $.ajax({
            url: ajaxUrl.getMerchantHaveTag,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
            	if ( data.success ) {
                    var str = '',data = data.data;
                    for( var i=0;i<data.length;i++ ){
                        str += '<img src="'+ data[i].image_url +'" alt="'+ data[i].name +'">';
                    }
                    $(".busniessTag").empty().append( str );
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
	},
    getSwitchFn:function(){
        var postData = {
            'shopUserId': shopUserId
        }
        $.ajax({
            url: ajaxUrl.getSwitch,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    var dom = $('.classifyStats div');
                    if ( data.message == "商品分类开关未打开" ) {
                        $(".comClassifyBtn").hide();
                        dom.attr("status", "close");
                        dom.find("span").css({
                            'margin-left':'25px'
                        }).end().css({
                            "background":"#e1e5e6"
                        })
                    }else{
                        $(".comClassifyBtn").show();
                        dom.attr("status", "open");
                        dom.find("span").css({
                            'margin-left':0
                        }).end().css({
                            "background":"#ff7c1c"
                        })
                    }
                }else{
                    errorTip( data.message );
                }
            },
            error: function(xhr, type){
            }
        });
    },
    setSwitchFn:function(switchValue){
        var postData = {
            "switchValue": switchValue,
            'shopUserId': shopUserId
        }
        $.ajax({
            url: ajaxUrl.switchProductsCategory,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    if ( data.message == "打开分类开关成功" ) {
                        $(".comClassifyBtn").show();
                    }else{
                        $(".comClassifyBtn").hide();
                    }
                    // successTip( data.message );
                }else{
                    errorTip( data.message );
                }
            },
            error: function(xhr, type){
            }
        });
    },
    saveBanner:function(id, imgPath, goodsId){
        var postData = {
            'id': id,
            'imgPath': imgPath,
            'goodsId': goodsId,
            'display': '1'
        }
        $.ajax({
            url: ($(".businessType").text() == '0'?ajaxUrl.updateShopBannerBatch:ajaxUrl.updateBatch),
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    $(".blackBg,.cDialog").hide()
                    pdObj.getShopData();
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
    delBannerFn:function(tar, id){
        var postData = {
            'bannerId': id,
            'display': '1'
        }
        $.ajax({
            url: ($(".businessType").text() == '0'?ajaxUrl.delBanner:ajaxUrl.bannerDel),
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    tar.parent().remove();
                    dialogPosition();
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
	getGoods: function(supName, catId, nextPage){
		if(supName == undefined){
            supName = '';
         }
         if(catId == undefined){
            catId = '';
         }
        $.ajax({
            url: ajaxUrl.getShowGoodsList+'?pageSize=10&pageNo='+ nextPage +'&supName='+ supName +'&catId='+ catId,
            type:'post',
            dataType: 'jsonp',
            jsonp: 'jsonpCallback', 
            success: function(data){
            	if(data.success == true){
                    var _data = data.data.data, str = '';
                    if(_data !== undefined){
                        totalCount = data.data.totalCount;
                        pageNum = totalCount % 10 === 0 ? parseInt(totalCount / 10) : parseInt(totalCount / 10) + 1;

                        // 分页代码
                        $('#remPage').show();
                        $('#remPage').pagination(pageNum, {
                        　   callback: PageCallback,  
                            'num_edge_entries': 0,     //边缘页数
                            'num_display_entries': 4,  //主体页数     
                            'items_per_page': 1,       //每页显示1项
                            'prev_text': '«',
                            'next_text': '»',
                            'current_page': nextPage-1,    //当前选中的页面 
                            'first_text': false,
                            'last_text': false
                        });

                        for(var i=0; i<_data.length; i++){                     
                        	str += '<li class="winList" goodsId="'+ _data[i].id +'">'+
	  							'<img src="'+ _data[i].mainImg +'">'+
	  							'<p>'+ (_data[i].spuName.length>8?_data[i].spuName.substring(0,8)+"...":_data[i].spuName) +'</p>'+
	  							'<span>¥'+ (_data[i].viewPrice/100).toFixed(2) +'</span>'+
	  							'<div class="winChoose" choose="false">'+
	  								'<img src="/shopDecorate/images/quit.png">'+
	  							'</div>'+
	  						'</li>';
                        }
                        $(".winMain ul").empty().append( str );
                        setGoodsChoose();
                        dialogPosition();
                    }else{
                        $('.winMain ul').empty().append('<p style="margin:5px 0 0 200px; text-align:center; color:#ccc;">没有查到商品<p>');
                        $('#remPage').hide();
                    }
                }else{
                    $('.winMain ul').empty().append('<p style="margin:5px 0 0 200px; text-align:center; color:#ccc;">没有查到商品<p>');
                    $('#remPage').hide();
                }
            },
            error: function(xhr, type){
            }
        });
	},
	saveWindow:function(spuIds){
		$.ajax({
            url:ajaxUrl.setShowWindowGoods+'?userId=30001667&spuIds=' +spuIds+'&source=1',
            type:'post',
            dataType:'jsonp',
            jsonp: 'jsonpCallback',
            success:function(data){
            	if ( data.success ) {
            		$(".dialog,.blackBg").hide();
                    pdObj.getWindowGoods();
            	}else{
            		errorTip(data.message);
            	}
            },
            error:function(){
                 errorTip("网络错误，请重试");
            }
        });
	},
	getWindowGoods:function(){
		$.ajax({
            url:ajaxUrl.getShowWindowGoods+'?userId=30001667&source=1',
            type:'post',
            dataType:'jsonp',
            jsonp: 'jsonpCallback',
            success:function(data){
              var _data = data.data;
              var html = '';
              if ( _data.length == 0 ) {
                $('.windowMain ul').empty().append('<img src="/shopDecorate/images/gfPic.jpg">');
                return;
              }
              for(var i=0; i<_data.length; i++){
                html += '<li goodsId="'+ _data[i].id +'">'+
                        '<div class="proImg"><img src="'+ _data[i].mainImg + '"/></div>'+
                        '<div class="goodsInfoBg"></div>'+
                        '<div class="goodsInfoMain">'+
                          '<p class="proName" style="color:#fff;">'+ _data[i].spuName +'</p>'+
                          '<div class="goodsInfoWrap">'+
                            '<span class="goodsPrice">¥'+ (_data[i].viewPrice/100).toFixed(0) +'.</span><em>'+ (_data[i].viewPrice/100).toFixed(2).substr(-2) +'</em>'+
                            ($(".rzfalse").attr('rzfalse') == 'true'?'<span class="voucher">券</span>':'')+
                            ($(".fsfalse").attr('fsfalse') == 'true'?'<span class="penalty">罚</span>':'')+
                          '</div>'+
                        '</div>'+
                        '</li>';
              }
              $('.windowMain ul').empty().append(html);
              $('.windowMain ul li').hover(function(){
                $(this).find(".goodsInfoBg,.goodsInfoMain").slideDown(200);
              },function(){
                $(this).find(".goodsInfoBg,.goodsInfoMain").slideUp(200);
              });
            },
            error:function(){
                errorTip("网络错误，请重试");
            }
          });
	},
    delWindowGoods:function(tar, goodsid){
        $.ajax({
            url:ajaxUrl.deleteShowWindowGoods+'?spuId='+ goodsid +'&source=1',
            type:'post', 
            dataType:'jsonp',
            jsonp: 'jsonpCallback',
            success:function(data){
                if(data.success){
                    tar.parent().remove();
                }else{
                    errorTip(data.message);
                }
            },
            error:function(){
            }
        });
    },
	goodsClassify: function(){
		$.ajax({
            url:ajaxUrl.goodsClassify,
            type:'post',
            dataType:'jsonp',
            jsonp: 'jsonpCallback',
            success:function(data){
                var data = data.data, str = '<li dataId=""><p>全部分类</p></li>';
                function gcChild(i){
                	var cStr = '';
                	for( var h=0;h<data[i].childList.length;h++ ){
                		cStr += '<li dataId="'+ data[i].childList[h].id +'">'+ data[i].childList[h].catName +'</li>'
                	}
                	return cStr;
                }
                for( var i=0;i<data.length;i++ ){
                	str += '<li dataId="'+ data[i].id +'">'+
  							'<p>'+ data[i].catName +'</p>'+
  							( gcChild(i) != ''?'<span>+</span><ul class="wcmChild">'+ gcChild(i) +'</ul>':'' )+
  						'</li>';
                }
                $(".winClassifyMain").empty().append( str );

            },
            error:function(){
              console.log('loadList request error');
            }
        });
	},
    comGoodsSaveFn:function( modualId, goodsId, titStatus, comTitle ){    //商品推荐保存
        var postData = {
            "type": "1",
            "modualId": modualId,
            "data": '{"goodsId":"'+goodsId+'","titStatus":"'+ titStatus +'","comTitle":"'+ comTitle +'" }'
        }
        $.ajax({
            url: ajaxUrl.publicSave,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    $(".dialog,.blackBg").hide();
                    pdObj.comGoodsGetFn(modualId);
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
    comGoodsGetFn:function(modualId){
        var postData = {
            "type": "1",
            "modualIds": modualId,
        }
        $.ajax({
            url: ajaxUrl.publicGetAll,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    if ( data.data.length == 0 ) return;
                    var modualId = data.data[0].modualId;
                    pdObj.comGoodsListFn(data, modualId);
                }else{
                    errorTip( data.message );
                }
            },
            error: function(xhr, type){
            }
        });
    },
    comGoodsListFn:function(data, modualId){
        var parseData = JSON.parse(data.data[0].data);
        $.ajax({
            url:ajaxUrl.comGoodsDetail+'?ids=['+ parseData.goodsId +']',
            type:'post',
            dataType:'jsonp',
            jsonp:'callback',
            success:function(data){
                var _data = data.data;
                for( var i=0;i<$(".commodity").length;i++ ){
                    if ( $(".commodity").eq(i).attr('id') == modualId ) {
                        var html = '', dom = $(".commodity").eq(i).find('.commodityMain').find("ul");
                        if ( _data.length == 0 ) {
                            dom.empty().append('<img src="/shopDecorate/images/commodityPic.jpg">');
                            return;
                        }
                        if ( parseData.titStatus == "0" ) {
                            $(".commodity").eq(i).find(".columnTit").hide();
                        }else{
                            $(".commodity").eq(i).find(".columnTit").show().find("span").text( parseData.comTitle );
                        }
                        for(var b=0; b<_data.length; b++){
                            html += '<li goodsId="'+ _data[b].id +'">'+
                                    '<div class="proImg"><img src="'+ _data[b].mainImg + '"/></div>'+
                                  '<p class="proName">'+ _data[b].spuName +'</p>'+
                                  '<div class="goodsInfoWrap">'+
                                    '<span class="goodsPrice">¥'+ ((_data[b].priceF).replace(/,/g,"")/100).toFixed(0) +'.</span><em>'+ ((_data[b].priceF).replace(/,/g,"")/100).toFixed(2).substr(-2) +'</em>'+
                                    ($(".rzfalse").attr('rzfalse') == 'true'?'<span class="voucher">券</span>':'')+
                                    ($(".fsfalse").attr('fsfalse') == 'true'?'<span class="penalty">罚</span>':'')+
                                    '<p>已售<span>'+_data[b].salesNumAggregated+'</span></p>'+
                                  '</div>'+
                                '</li>';
                        }
                        dom.empty().append(html);
                    }
                }
            },
            error:function(){
            }
          });
    },
    customPicSave:function(modualId, size, imgPath, goodsId){   //保存自定义图片
        var postData = {
            "type": "1",
            "modualId": modualId,
            "data": '{"size":"'+ size +'","imgPath":"'+ imgPath +'","goodsId":"'+ goodsId +'" }'
        }
        $.ajax({
            url: ajaxUrl.publicSave,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    $(".dialog,.blackBg").hide();
                    pdObj.customPicGet(modualId);
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
    customPicGet:function(modualId){    //查询自定义图片
        var postData = {
            "type": "1",
            "modualIds": modualId,
        }
        $.ajax({
            url: ajaxUrl.publicGetAll,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    if ( data.data.length == 0 ) return;
                    for( var i=0;i<$(".customAd").length;i++ ){
                            for( var b=0;b<data.data.length;b++ ){
                                if ( $(".customAd").eq(i).attr("id") == data.data[b].modualId ) {
                                    var dom = $(".customAd").eq(i).find(".cusMain img"),
                                        _data = JSON.parse(data.data[b].data);
                                    dom.attr("src", (_data.imgPath == ""?'//enterprise.qbao.com/shopDecorate/images/customAdPic.jpg':_data.imgPath) );
                                    if ( _data.imgPath != "" ) {
                                        if ( _data.size == '1' ) {
                                            dom.css("height", "40px");
                                        }else if ( _data.size == '2' ) {
                                            dom.css("height", "100px");
                                        }else if ( _data.size == '3' ) {
                                            dom.css("height", "300px");
                                        }
                                    }
                                    
                                }
                            }
                        }
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
    getSellingGoods:function(){
        var postData = {
            "shopUserId": "30001667",
            "keyWord": "",
            "sortBy": "0",
            "orderBy": "1",
            "currentPage": "1",
            "pageSize": "4"
        }
        $.ajax({
            url: ajaxUrl.sellingGoods,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    var _data = data.data.products;
                    var html = '';
                    if ( _data.length == 0 ) {
                        $('.sellingMain ul').empty().append('<img src="/shopDecorate/images/commodityPic.jpg">');
                        return;
                    }
                    for(var i=0; i<_data.length; i++){
                        html += '<li goodsId="'+ _data[i].id +'">'+
                                '<div class="proImg"><img src="'+ _data[i].mainImg + '"/></div>'+
                                '<p class="proName">'+ _data[i].spuName +'</p>'+
                              '<div class="goodsInfoWrap">'+
                                '<span class="goodsPrice">¥'+ Number(_data[i].viewPriceYuan).toFixed(0) +'.</span><em>'+ Number(_data[i].viewPriceYuan).toFixed(2).substr(-2) +'</em>'+
                                ($(".rzfalse").attr('rzfalse') == 'true' ?'<span class="voucher">券</span>':'')+
                                ($(".fsfalse").attr('fsfalse') == 'true'?'<span class="penalty">罚</span>':'')+
                                '<p>已售<span>'+_data[i].salesNumAggregated+'</span></p>'+
                              '</div>'+
                            '</li>';
                    }
                    $('.sellingMain ul').empty().append(html);
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
	uploadPic:function(obj, name, fn, cover){	//图片上传
		obj.fileupload({
		    url: ajaxUrl.upload,
		    dataType: 'json',
		    formData: {
		        name: name
		    }
		}).on('fileuploadprogressall', function(e, data) {
		    //todo
		}).on('fileuploaddone', function(e, data) {
		    if (data.result.success) {
		        if ( data.total>1024*1024 ) {
		            errorTip('图片大小不可超过1M');
		            return;
		        }
		        fn.call(this, data);
                var postData;
                if ( cover != "cover" ) {
                    postData = {
                        'logoPath': data.result.data.imageUrl,
                        'display': '1'
                    }
                }else{
                    postData = {
                        'cover': data.result.data.imageUrl,
                        'display': '1'
                    }
                }
			    $.ajax({ 
			        url: ( cover != "cover"?($(".businessType").text() == '0'?ajaxUrl.updateShopImg:ajaxUrl.merchantUpdate):($(".businessType").text() == '0'?ajaxUrl.coverIndividual:ajaxUrl.coverBusi) ),
			        type: "POST",
			        dataType: "json",
			        data:postData,
			        success: function(data){
			            if ( data.success ) {
			            }else{
			            	errorTip(data.message);
			            }
			        },
			        error: function(xhr, type){
			        }
			    });
		    }else{
		        errorTip(data.result.message);
		    }
		}).on('fileuploadfail', function(e, data) {
		    errorTip("上传错误!");
		});
	},
    submitFn:function(modualId){
        var postData = {
            "type": "1",
            "data": '{"pcModualId":"'+ modualId +'","appModualId":"'+ lengthReduce(localStorage.getItem('appModualId')) +'"}'
        }
        $.ajax({
            url: ajaxUrl.submit,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    successTip(data.message);
                }else{
                    errorTip( data.message );
                }
            },
            error: function(xhr, type){
            }
        });
    }
}

pdObj.setDecorate();
pdObj.getShopData();
pdObj.getTag();
pdObj.getSwitchFn();

pdObj.uploadPic($("#uploadLogo"), "newLogo", function(data){    //logo
	$(".logoPic").attr("src", data.result.data.imageUrl);
	if ( $(".businessType").text() == '0' ) {
        $('.logoStatus').show();
		$.ajax({
            url: ajaxUrl.getShopLogoApply,
            type: "POST",
            dataType: "json",
            success: function(data){
                if ( data.success ) {
                    switch(data.data.status){
                    case 0:
                        $('.logoStatus p').find("span").text('审核中');
                        break;
                    case 1:
                        $('.logoStatus p').find("span").text('审核通过');
                        break;
                    case 2:
                    	$('.logoStatus p').find("span").text('审核不通过（'+data.data.description+'）');
                        break;
                }
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
	}
})
pdObj.uploadPic($("#uploadSign"), "newSign", function(data){    //店招
    $(".signPic").attr("src", data.result.data.imageUrl);
}, "cover")
pdObj.uploadPic($(".bannerList #uploadBannerDo1"), 'newBanner1', function(data){
    $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
    $(".uploadBannerBtn").hide();
})
pdObj.uploadPic($("#customUploadDo"), "customPic", function(data){    //自定义图片
    $(".customDPic img").attr("src", data.result.data.imageUrl);
})

function PageCallback(page_index, jq){         
	nextPage = page_index+1;
	pdObj.getGoods('', '', nextPage);
}

$(".releaseBtn").on("click",function(){ //发布
    var modualId = '';
    if ( $('.banner').attr("id") != undefined ) {
        modualId = $('.banner').attr("id")+',';
    }
    for( var i=0;i<$(".gridly").find(".column").length;i++ ){
        modualId += $(".gridly").find(".column").eq(i).attr("id")+",";
    }
    localStorage.setItem('pcModualId',modualId);
    pdObj.submitFn( lengthReduce(modualId) );
})

$(".confirm").on("click",function(){
	if ( $(this).parent().parent().hasClass("aDialog") ) { //logo
		$(".shopPic img").attr("src", $(".logoPic").attr("src"));
		$(".dialog,.blackBg").hide();
	}else if ( $(this).parent().parent().hasClass("cDialog") ) {   //banner
        var id = '', imgPath = '', goodsId = '';
        for( var i=0;i<$(".bannerList li").length;i++ ){
            id += $(".bannerList li").eq(i).attr('dataid')+',';
            imgPath += $(".bannerList li").eq(i).find(".uploadBanner img").attr("src")+',';
            goodsId += $(".bannerList li").eq(i).find(".relatedCom").attr("goodsid")+',';
        }
        for( var b=0;b<lengthReduce(goodsId).split(',').length;b++ ){
            if ( goodsId.split(',')[b] == "" ) {
                errorTip("banner图必须关联商品");
                return;
            }
        }
        pdObj.saveBanner(lengthReduce(id), lengthReduce(imgPath), lengthReduce(goodsId));
    }else if ( $(this).parent().siblings(".title").text() == '编辑店招' ) {
        pdObj.getShopData();
        $(".bDialog,.blackBg").hide();
    }else if ( $(this).parent().siblings(".title").text() == '自定义图片' ) {
        var dom = $(this).parent(), 
            modualId = dom.parent().attr("modualId"),
            size = dom.attr("size"),
            imgPath = $(".customDPic img").attr("src"),
            goodsId = dom.siblings(".content").find(".relatedCom").attr("goodsId");
        pdObj.customPicSave(modualId, size, imgPath, goodsId);
    }else if ( $(this).parent().siblings(".title").text() == '橱窗推荐' ) {
		var spuIds = '';
		for( var i=0;i<$(".winHasChoose ul").find("li").length;i++ ){
			spuIds += $(".winHasChoose ul").find("li").eq(i).attr("goodsId")+','
		}
		spuIds = spuIds.substring(0,spuIds.length-1);
		pdObj.saveWindow(spuIds);
	}else if ( $(this).parent().siblings(".title").text() == '商品推荐' ) {
        var modualId = $(this).parent().parent().attr("modualId"),
            goodsId = $(this).parent().siblings(".content").find(".winTab").attr("allchoose"),
            titStatus = ( $(".sctShowTit").attr('chooseIt') == "true"?'1':'0' ),
            comTitle = $.trim( $(".comTitInput").val() );
        goodsId = goodsId.substring(0,goodsId.length-1);
        if ( titStatus == '1' && comTitle == '' ) {
            $(".sctWarn").css("display","inline-block");
            setTimeout(function(){
                $(".sctWarn").hide();
            },3000)
            return;
        }
        pdObj.comGoodsSaveFn(modualId, goodsId, titStatus, comTitle);
    }else if ( $(this).parent().siblings(".title").text() == '关联商品' ) {
        $(this).parents(".dDialog").hide();
        if ( $(".dDialog").attr("from") == 'banner' ) {
            for( var i=0;i<$(".bannerList").find("li").length;i++ ){
                if ( $(this).attr('seleId') == $(".bannerList").find("li").eq(i).find(".f").attr('seleId') ) {
                    $(".bannerList").find("li").eq(i).find(".relatedCom").attr("goodsId", $(this).data("sele").goodsId);
                    $(".bannerList").find("li").eq(i).find(".relatedCom img").attr("src", $(this).data("sele").imgSrc);
                }
            }
            $(".cDialog").show();
        }else if ( $(".dDialog").attr("from") == 'custom' ) {
            $(".relatedCom").attr("goodsId", $(this).data("sele").goodsId);
            $(".relatedCom img").attr("src", $(this).data("sele").imgSrc);
            $(".hDialog").show();
        }
    }
})

$(".editClassify").on("click",function(){
	window.open( '//goods.qbao.com/storeCatalog/toCatalogManageIndex.html?_merchant_user_id_='+$.urlParam("_merchant_user_id_") );
})

$( ".gridly" ).sortable({
    revert: true
});

$(".list").hover(function(){
	$(this).find(".addModular").show();
},function(){
	$(this).find(".addModular").hide();
})
$(".comClassify").hover(function(){
    $(".comClassifyOpe").show();
},function(){
    $(".comClassifyOpe").hide();
})
function editBannerHover(){
    $(".relatedCom").hover(function(){
        $(this).find(".relatedComBtn").show();
    },function(){
        $(this).find(".relatedComBtn").hide();
    })
    $(".uploadBanner").hover(function(){
        $(this).find(".uploadBannerBtn").show();
    },function(){
        $(this).find(".uploadBannerBtn").hide();
    })
}
editBannerHover()

$(".classifyStats").on("click","div",function(){
    var _this = $(this);
	if ( _this.attr("status") == "open" ) {
		_this.attr("status", "close");
		_this.find("span").css({
			'margin-left':'25px'
		}).end().css({
			"background":"#e1e5e6"
		})
	}else{
		_this.attr("status", "open");
		_this.find("span").css({
			'margin-left':0
		}).end().css({
			"background":"#ff7c1c"
		})
	}
	var switchValue = ( _this.attr("status") == 'close'?"0":"1" );
    pdObj.setSwitchFn(switchValue);
})

$(".gridly").on("click",'.up',function(){
	var $dom = $(this).parent().parent();
	$dom.insertBefore($dom.prev());
})

$(".gridly").on("click",".down",function(e){
	var $dom = $(this).parent().parent();
	$dom.insertAfter($dom.next());
})

$(".useDefaultSign").on("click",function(){
	$(".signPic").attr("src","/shopDecorate/images/signPic.jpg");
    var postData = {
        'cover': "//enterprise.qbao.com/shopDecorate/images/signPic.jpg",
        'display': '1'
    }
    $.ajax({ 
        url: ( $(".businessType").text() == '0'?ajaxUrl.coverIndividual:ajaxUrl.coverBusi ),
        type: "POST",
        dataType: "json",
        data:postData,
        success: function(data){
            if ( data.success ) {
            }else{
                errorTip(data.message);
            }
        },
        error: function(xhr, type){
        }
    });
})

$(".bannerDel").hide();
$(".bannerAddBtn").on("click",function(){
	if ( $(".bannerList").find("li").length > 4 ) {
		$(".bannerWarn").css("display","inline-block");
		setTimeout(function(){
			$(".bannerWarn").hide();
		},3000)
		return;
	}
	var str = '';
	str = '<li dataId="0"><div style="display: inline-block;" class="uploadBanner">'+
            '<img src="/shopDecorate/images/getBanner.jpg" >'+
            '<div class="uploadBannerBtn">'+
                '<div></div>'+
                '<p class="g">上传banner</p>'+
                '<input type="file" name="newBanner'+ ($(".bannerList").find("li").length+1) +'" id="uploadBannerDo'+ ($(".bannerList").find("li").length+1) +'">'+
            '</div>'+
        '</div><div class="relatedCom" style="display: inline-block;" goodsId="">'+
            '<img src="/shopDecorate/images/bannerBr.jpg">'+
            '<div class="relatedComBtn">'+
                '<div></div>'+
                '<p class="f" seleId="'+ ($(".bannerList").find("li").length+1) +'">关联商品</p>'+
            '</div>'+
        '</div>'+
		'<div class="bannerDel"><img src="/shopDecorate/images/bannerDel.png"></div>'+
		'</li>';
	$(".bannerList").append( str );
    pdObj.uploadPic($(".bannerList #uploadBannerDo"+ ($(".bannerList").find("li").length) ), 'newBanner'+ ($(".bannerList").find("li").length), function(data){
        $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
        $(".uploadBannerBtn").hide();
    })
    editBannerHover();
	if ( $(".bannerList").find("li").length > 1 ) {
		$(".bannerDel").css('display','inline-block');
	}
	$(".cDialog").css({
	  'left': ($(window).width()-$(".dialog").width())/2+'px',
	  'top': ($(window).height()-$(".cDialog").height())/2+'px'
	})
})

function editBannerDialogFn(data){
    $(".bannerList").empty();
    for( var i=0;i<data.length;i++ ){
        var str = '<li dataId="'+ data[i].id +'"><div style="display: inline-block;" class="uploadBanner">'+
            '<img src="'+ data[i].imgPath +'" >'+
            '<div class="uploadBannerBtn">'+
                '<div></div>'+
                '<p class="g">上传banner</p>'+
                '<input type="file" name="reBanner'+ (i+1) +'" id="reuploadBannerDo'+ (i+1) +'">'+
            '</div>'+
        '</div><div class="relatedCom" style="display: inline-block;" goodsId="'+ data[i].goodsId +'">'+
            '<img src="'+ data[i].goodsImg +'">'+
            '<div class="relatedComBtn">'+
                '<div></div>'+
                '<p class="f" seleId="'+ (i+1) +'">关联商品</p>'+
            '</div>'+
        '</div>'+
        '<div class="bannerDel" style="display:inline-block;"><img src="/shopDecorate/images/bannerDel.png"></div>'+
        '</li>';
        $(".bannerList").append( str );
        pdObj.uploadPic($(".bannerList #reuploadBannerDo"+ (i+1) ), 'reBanner'+ (i+1), function(data){
            $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
            $(".uploadBannerBtn").hide();
        })
    }
    
    editBannerHover();
    dialogPosition();
}

$(".bannerList").on("click",".bannerDel",function(){
    var tar = $(this), id = tar.parent().attr("dataid");
    pdObj.delBannerFn(tar, id);
	if ( $(".bannerList").find("li").length < 2 ) {
		$(".bannerDel").hide();
	}
})

$(".listMain").on("click",".addModular",function(){
    if ( $(this).siblings(".listName").text() == '橱窗推荐' ) {
        var numWin = ($(".gridly").find(".galleryFeatured").length == 0?0:1);
        if ( numWin > 0 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="galleryFeatured column" id="1-1">'+
                '<div class="columnTit">'+
                    '<span>橱窗推荐</span>'+
                '</div>'+
                '<div class="colunmMain windowMain">'+
                    '<ul>'+
                        '<img src="/shopDecorate/images/gfPic.jpg">'+
                    '</ul>'+
                '</div>'+
                '<div class="move">'+
                    '<div class="up"><img src="/shopDecorate/images/upPic.png"></div>'+
                    '<div class="down"><img src="/shopDecorate/images/downPic.png"></div>'+
                '</div>'+
                '<div class="del">删除</div>'+
                '<div class="edit d">编辑</div>'+
            '</div>';
        $(".gridly").append( str );
        numWin++;
        $(this).siblings('.listNum').find("span").text( numWin );
        window.scrollTo(0, $(".galleryFeatured").offset().top-140 );
    }else if ( $(this).siblings(".listName").text() == '商品推荐' ) {
        var numCommodity = ($(".gridly").find(".commodity").length == 0?0:$(".gridly").find(".commodity").length);
        if ( numCommodity > 4 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="commodity column" id="2-'+ (numCommodity+1) +'">'+
                '<div class="columnTit">'+
                    '<span>商品推荐</span>'+
                '</div>'+
                '<div class="colunmMain commodityMain">'+
                    '<ul>'+
                        '<img src="/shopDecorate/images/commodityPic.jpg">'+
                    '</ul>'+
                '</div>'+
                '<div class="move">'+
                    '<div class="up"><img src="/shopDecorate/images/upPic.png"></div>'+
                    '<div class="down"><img src="/shopDecorate/images/downPic.png"></div>'+
                '</div>'+
                '<div class="del">删除</div>'+
            '<div class="edit e">编辑</div>'+
            '</div>';
        $(".gridly").append( str );
        $(".addCommodity").attr("comModuleId", $(".addCommodity").attr("comModuleId")+"2-"+(numCommodity+1)+"," );
        numCommodity++;
        $(this).siblings('.listNum').find("span").text( numCommodity );
        window.scrollTo(0, $(".commodity").eq(numCommodity-1).offset().top-140 );
    }else if ( $(this).siblings(".listName").text() == '热销商品' ) {
        var numSelling = ($(".gridly").find(".selling").length == 0?0:1);
        if ( numSelling > 0 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="selling column" id="3-1">'+
            '<div class="columnTit">'+
                '<span>热销商品</span>'+
            '</div>'+
            '<div class="colunmMain sellingMain">'+
                '<ul>'+
                    '<img src="/shopDecorate/images/commodityPic.jpg">'+
                '</ul>'+
            '</div>'+
            '<div class="move" style="right: 60px;">'+
                '<div class="up"><img src="/shopDecorate/images/upPic.png"></div>'+
                '<div class="down"><img src="/shopDecorate/images/downPic.png"></div>'+
            '</div>'+
            '<div class="del" style="right: 2px;">删除</div>'+
        '</div>';
        $(".gridly").append( str );
        pdObj.getSellingGoods();
        numSelling++;
        $(this).siblings('.listNum').find("span").text( numSelling );
        window.scrollTo(0, $(".selling").offset().top-140 );
    }else if ( $(this).siblings(".listName").text() == 'banner' ) {
        var numBanner = ($(".banner").length == 0?0:1);
        if ( numBanner > 0 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="banner" id="4-1">'+
                '<div class="banner-container">'+
                    '<div class="swiper-wrapper banner-wrapper">'+
                        '<div class="swiper-slide"><img class="scroll-img" src="/shopDecorate/images/defaultBanner.jpg"></div>'+
                    '</div>'+
                    '<div class="swiper-pagination"></div>'+
                '</div>'+
                '<div class="del">删除</div>'+
                '<div class="edit c">编辑</div>'+
            '</div>';
            $(str).insertAfter(".comClassify");
        numBanner++;
        $(this).siblings('.listNum').find("span").text( numBanner );
        window.scrollTo(0, $(".banner").offset().top-140 );
    }else if ( $(this).siblings(".listName").text() == '自定义图片' ) {
        var numCustomPic = ($(".gridly").find(".customAd").length == 0?0:$(".gridly").find(".customAd").length);
        if ( numCustomPic > 9 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="customAd column" id="5-'+ (numCustomPic+1) +'">'+
                '<div class="colunmMain cusMain">'+
                    '<img src="/shopDecorate/images/customAdPic.jpg">'+
                '</div>'+
                '<div class="move">'+
                    '<div class="up"><img src="/shopDecorate/images/upPic.png"></div>'+
                    '<div class="down"><img src="/shopDecorate/images/downPic.png"></div>'+
                '</div>'+
                '<div class="del">删除</div>'+
                '<div class="edit h">编辑</div>'+
            '</div>';
        $(".gridly").append( str );
        $(".addCustomPic").attr("cusModuleId", $(".addCustomPic").attr("cusModuleId")+"5-"+(numCustomPic+1)+"," );
        numCustomPic++;
        $(this).siblings('.listNum').find("span").text( numCustomPic );
        window.scrollTo(0, $(".customAd").eq(numCustomPic-1).offset().top-140 );
    }
})
$("body").on("click",".del",function(){
    $(this).parent().remove();
    if ( $(this).siblings('.columnTit').find('span').text() == '橱窗推荐' ) {
        $(".leftWindow").find(".listNum span").text($(".gridly").find(".galleryFeatured").length);
    }else if ( $(this).siblings('.columnTit').find('span').text() == '商品推荐' ) {
        $(".leftCom").find(".listNum span").text($(".gridly").find(".commodity").length);
        if ( $(".addCommodity").attr("comModuleId").indexOf( $(this).parent().attr("id") ) > -1 ) {
            var delModuleId = new RegExp($(this).parent().attr("id")+",","g");
            $(".addCommodity").attr("comModuleId", $(".addCommodity").attr("comModuleId").replace(delModuleId,"") );
        }
    }else if ( $(this).siblings('.columnTit').find('span').text() == '热销商品' ) {
        $(".leftSelling").find(".listNum span").text($(".gridly").find(".selling").length);
    }else if ( $(this).parent().hasClass("banner") ) {  //banner
        $(".leftBanner").find(".listNum span").text($(".banner").length);
    }else if ( $(this).parent().hasClass("customAd") ) {
        $(".leftCustomPic").find(".listNum span").text($(".customAd").length);
        if ( $(".addCustomPic").attr("cusModuleId").indexOf( $(this).parent().attr("id") ) > -1 ) {
            var delModuleId = new RegExp($(this).parent().attr("id")+",","g");
            $(".addCustomPic").attr("cusModuleId", $(".addCustomPic").attr("cusModuleId").replace(delModuleId,"") );
        }
    }
})

$(".customType").on("click","img",function(){
	$(this).attr("src","/shopDecorate/images/radioChoose.png");
	$(this).parent().siblings().find("img").attr("src","/shopDecorate/images/radioQuit.png");
	if ( $(this).parent().index() == 0 ) {
		$(".customPicInfo span").text('40');
        $(".customDPic img").css("height", "19px");
	}else if ( $(this).parent().index() == 1 ) {
		$(".customPicInfo span").text('100');
        $(".customDPic img").css("height", "47px");
	}else{
		$(".customPicInfo span").text('300');
        $(".customDPic img").css("height", "143px");
	}
    $(this).parents(".content").siblings('.btnWrap').attr( "size", ($(this).parent().index() == 0?"1":$(this).parent().index() == 1?"2":$(this).parent().index() == 2?"3":"1") );
    dialogPosition();
})

$(".close,.cancel").on("click",function(){
    if ( $(this).parents(".dDialog").find(".title").text() == '关联商品' ) {
        $(".dDialog").hide();
        if ( $(".dDialog").attr("from") == 'banner' ) {
            $(".cDialog").show();
        }else if ( $(".dDialog").attr("from") == 'custom' ) {
            $(".hDialog").show();
        }
    }else{
        $(".blackBg,.dialog").hide();
    }
})

$(".a").on("click",function(){
	$(".blackBg,.aDialog").show();
})

$(".b").on("click",function(){
	$(".blackBg,.bDialog").show();
})

$("body").on("click",".c",function(){  //编辑banner
	$(".blackBg,.cDialog").show();
    pdObj.getShopData();
})

$(".gridly").on("click",".h",function(){
    $(".blackBg,.hDialog").show();
    $(".hDialog").attr("modualId", $(this).parent().attr("id"));
})

$(".gridly").on("click",".edit",function(){
	if ( $(this).hasClass("d") ) {
		$(".blackBg,.dDialog,.winTab").show();
        $(".functionChange,.goodsNumtip").hide();
		$(".dDialog").find(".title").text("橱窗推荐");  
        var allChoose = '', dom = $(this).siblings(".windowMain").find("ul");
        if ( dom.find("li").length > 0 ) {
            for( var i=0;i<dom.find("li").length;i++ ){
                allChoose += dom.find("li").eq(i).attr("goodsId")+',';
            }
        }
        pdObj.getGoods('', '', 1);
        $(".winTab").attr('allChoose', allChoose);
        getHaveChoose(dom);
	}else if ( $(this).hasClass("e") ) {
		$(".blackBg,.dDialog,.winTab,.functionChange,.goodsNumtip,.comDialogContent").show();
        $(".setComTit").hide();
		$(".dDialog").find(".title").text("商品推荐");
        $(".dDialog").attr("modualId", $(this).parent().attr("id"));

        $(".functionChange li").eq(0).addClass("fcActive").end().eq(1).removeClass("fcActive");
        $(".fcActiveLine").css("margin-left","0");

        var allChoose = '', dom = $(this).siblings(".commodityMain").find("ul");
        if ( dom.find("li").length > 0 ) {
            for( var i=0;i<dom.find("li").length;i++ ){
                allChoose += dom.find("li").eq(i).attr("goodsId")+',';
            }
        }
        pdObj.getGoods('', '', 1);
        $(".winTab").attr('allChoose', allChoose);
        getHaveChoose(dom);
	}
})

$("body").on("click",".f",function(){
    $(".blackBg,.dDialog").show();
    $(".winTab,.cDialog,.hDialog,.functionChange,.goodsNumtip").hide();
    $(".winTab").attr("allchoose", $(this).parents(".relatedCom").attr("goodsid") );
    if ( $(this).parents(".dialog ").hasClass("cDialog") ) {    //banner
        $(".dDialog").attr("from","banner");
    }else if ( $(this).parents(".dialog ").hasClass("hDialog") ) {     //自定义图片
        $(".dDialog").attr("from","custom");
    }
    $(".dDialog").find(".title").text("关联商品");
    $(".dDialog").find(".confirm").attr('seleId', $(this).attr('seleId'));
    pdObj.getGoods('', '', 1);
    pdObj.goodsClassify();
})

$(".winSearch").on("click",function(){
    pdObj.getGoods($(".commodityNameD input").val(), $(".winClassifyBtn").attr("dataId"), 1);
})

$('.functionChange').on("click",'li',function(){
    $(this).siblings("li").removeClass("fcActive").end().addClass("fcActive");
    if ( $(this).index() == 0 ) {
        $(".fcActiveLine").css({
            "margin-left":"0"
        })
        $(".comDialogContent,#remPage").show();
        $(".setComTit").hide();
    }else{
        $(".fcActiveLine").css({
            "margin-left":"110px"
        })
        $(".setComTit").show();
        $(".comDialogContent,#remPage").hide();
    }
})

$(".setComTit").on("click","img",function(){
    if ( $(this).attr("chooseIt") == "false" ) {
        $(this).attr({"src":"/shopDecorate/images/radioChoose.png","chooseIt":"true"});
        $(this).siblings("img").attr({"src":"/shopDecorate/images/radioQuit.png","chooseIt":"false"});
    }
    console.log( $(this).index() )
    if ( $(this).index() == 1 ) {
        $(".comTitInput").show();
    }else{
        $(".comTitInput").hide();
    }
})

$(".winTab").on("click","p",function(){
	$(this).siblings("p").removeClass("winActive").end().addClass("winActive");
	if ( $(this).index() == 0 ) {
		$(".winActiveLine").css({
			"margin-left":"0",
			"width":"53px"
		})
		$(".winMain,#remPage").show();
		$(".winHasChoose").hide();
	}else{
		$(".winActiveLine").css({
			"margin-left":"101px",
			"width":"83px"
		})
		$(".winHasChoose").show();
		$(".winMain,#remPage").hide();
	}
})

function setGoodsChoose(){
    var dom = '';
    for( var i=0;i<$(".winMain ul").find("li").length;i++ ){
        dom = $(".winMain ul").find("li").eq(i);
        if ( $('.winTab').attr('allchoose').indexOf($(".winMain ul").find("li").eq(i).attr('goodsid')) > -1 ) {
            dom.find(".winChoose").attr('choose','true');
            dom.find(".winChoose").find('img').attr('src','/shopDecorate/images/choose.png');
        }else{
            dom.find(".winChoose").attr('choose','false');
            dom.find(".winChoose").find('img').attr('src','/shopDecorate/images/quit.png');
        }
    }
    $(".hasChooseNum span").text( $(".winHasChoose ul").find("li").length );
}
function getHaveChoose(tar){
    var str = '', winDow = '';
    for( var h=0;h<tar.find("li").length;h++ ){
        winDow = tar.find("li").eq(h);
        str += '<li class="winList" goodsId="'+ winDow.attr('goodsid') +'">'+
                '<img src="'+ winDow.find('img').attr('src') +'">'+
                '<p>'+ (winDow.find("p").text().length>8?winDow.find("p").text().substring(0,8)+"...":winDow.find("p").text()) +'</p>'+
                '<span>¥'+ winDow.find("span").text().substring(1,winDow.find("span").text().length) +'</span>'+
                '<div class="winChoose delGoods" choose="false">'+
                    '<img src="/shopDecorate/images/delGoods.png">'+
                '</div>'+
            '</li>';
    }
    $(".winHasChoose ul").empty().append( str );
    $(".hasChooseNum span").text( $(".windowMain ul").find("li").length );
}

var hasChooseNum = 0;
$(".winMain").on("click",".winChoose",function(){
	var _this = $(this);
    if ( _this.parents(".content").siblings(".title").text() == "关联商品" ) {
        _this.find("img").attr("src","/shopDecorate/images/choose.png");
        _this.attr("choose","true");
        _this.parent().siblings("li").find(".winChoose").attr("choose","false");
        _this.parent().siblings("li").find(".winChoose").find("img").attr("src","/shopDecorate/images/quit.png");
        _this.parents(".content").siblings(".btnWrap").find(".confirm").data("sele", { goodsId: _this.parent().attr("goodsid"), imgSrc: _this.siblings("img").attr("src") });
        return;
    }
	var limitNum = ( $(".dDialog").find(".title").text() == "橱窗推荐"?3:11 );
    hasChooseNum = $(".hasChooseNum span").text();
	if ( _this.attr("choose") == "false" ) {
		if ( hasChooseNum > limitNum ) {
			$(".winBannerWarn p").find("span").text( limitNum+1 );
			$(".winBannerWarn").css("display","inline-block");
			setTimeout(function(){
				$(".winBannerWarn").hide();
			},3000)
			return;
		}
		hasChooseNum++;
		_this.find("img").attr("src", "/shopDecorate/images/choose.png");
		_this.attr("choose","true");
		var cloneStr = _this.parent().clone();
		cloneStr.find(".winChoose").find("img").attr("src","/shopDecorate/images/delGoods.png");
		cloneStr.find(".winChoose").addClass("delGoods");
		$(".winHasChoose ul").append( cloneStr );
		$(".hasChooseNum span").text( hasChooseNum );
        $(".winTab").attr('allChoose',$(".winTab").attr("allChoose")+$(this).parent().attr("goodsid")+",");
	}else{
        var regGoodsId = new RegExp($(this).parent().attr("goodsid")+",","g");
		hasChooseNum--;
		_this.find("img").attr("src", "/shopDecorate/images/quit.png");
		_this.attr("choose","false");
		$(".hasChooseNum span").text( hasChooseNum );
        $(".winTab").attr('allChoose', $(".winTab").attr("allChoose").replace(regGoodsId, ''));
        for( var i=0;i<$(".winHasChoose").find("li").length;i++ ){
            if ( $(".winTab").attr('allChoose').indexOf($(".winHasChoose").find("li").eq(i).attr("goodsid")) == -1 ) {
                pdObj.delWindowGoods($(".winHasChoose").find("li").eq(i).find(".delGoods"), $(".winHasChoose").find("li").eq(i).attr('goodsid'));
            }
        }
	}
})
$(".winHasChoose").on("click",".delGoods",function(){
    var This = $(this);
    var regGoodsId = new RegExp($(this).parent().attr("goodsid")+",","g");
    $(".winTab").attr('allChoose', $(".winTab").attr("allChoose").replace(regGoodsId, ''));
    setGoodsChoose();
    pdObj.delWindowGoods(This, This.parent().attr('goodsid'));
})


function upWinClassify(){
	$(".winClassifyMain").slideUp(200);
	$(".winClassifyBtn").find("img").css({
		"transform":"rotate(0deg)"
	})
}
$(".winClassifyBtn").on("click",function(e){
	e.stopPropagation();
	if ( $(".winClassifyMain").is(":visible") ) {
		upWinClassify();
	}else{
		$(".winClassifyMain").slideDown(200);
		$(this).find("img").css({
			"transform":"rotate(180deg)"
		})
	}
})
$(".winClassifyMain").on("click","li",function(e){
	e.stopPropagation();
	if ( $(this).find("li").length < 1 ) {
		$(".winClassifyBtn p").text( $(this).find("p").text() );
        $(".winClassifyBtn").attr("dataId", $(this).attr("dataid"));
		upWinClassify();
	}
	if ( $(this).find(".wcmChild").is(":visible") ) {
		$(this).find(".wcmChild").slideUp(200);
		$(this).find("span").text("+");
	}else{
		$(this).find(".wcmChild").slideDown(200);
		$(this).find("span").text("-");
	}
})
$(".wcmChild").on("click","li",function(e){
	e.stopPropagation();
	$(".winClassifyBtn p").text( $(this).text() );
	upWinClassify();
})
$(document).on("click",function(){
	upWinClassify();
})

function setFixed(){
	if ( $(document).scrollTop() > 190 ) {
		$(".mainTab").css({
			'position': 'fixed'
		})
		$(".left").css({
			'position': 'fixed'
		})
		$(".right").css({
			'margin': '78px 0 0 210px',
		})
	}else{
		$(".mainTab").css({
			'position': 'relative'
		})
		$(".left").css({
			'position': 'static'
		})
		$(".right").css({
			'margin': '0'
		})
	}
}
setFixed();
$(document).on("scroll",function(){
	setFixed();
})


function errorTip(message){
    var tip = "<div id='error_tip' class='error-tip'></div>";
    if (!$("#error_tip")[0]) {
        $("body").append(tip);
    }
    var h = $("#error_tip").width();
    $("#error_tip").css("margin-left", -h / 2).html(message).show();
    setTimeout(function() {
        $("#error_tip").hide().html("");
    }, 3000);
}
function successTip(message){
    var tip = "<div id='success_tip' class='success-tip'></div>";
    if (!$("#success_tip")[0]) {
        $("body").append(tip);
    }
    var h = $("#success_tip").width();
    $("#success_tip").css("margin-left", -h / 2).html(message).show();
    setTimeout(function() {
        $("#success_tip").hide().html("");
    }, 3000);
}

function lengthReduce(str){
    if ( str == null ) {
        str = '';
    }
    return str.substring(0,str.length-1)
}

function dialogPosition(){
	$(".dialog").css({
	  'left': ($(window).width()-$(".dialog").width())/2+'px',
	  'top': ($(window).height()-$(".dialog").outerHeight())/2+'px'
	})
	$(".dDialog").css({
	  'left': ($(window).width()-$(".dDialog").width())/2+'px',
	  'top': ($(window).height()-$(".dDialog").outerHeight())/2+'px'
	})
	$(".hDialog").css({
	  'left': ($(window).width()-$(".hDialog").width())/2+'px',
	  'top': ($(window).height()-$(".hDialog").outerHeight())/2+'px'
	})
    $(".cDialog").css({
      'left': ($(window).width()-$(".cDialog").width())/2+'px',
      'top': ($(window).height()-$(".cDialog").outerHeight())/2+'px'
    })
}
dialogPosition();
$(window).on("resize",function(){
	dialogPosition();
})


})


