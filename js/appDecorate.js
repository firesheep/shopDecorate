$(function(){
jQuery.urlParam = function(name){
    var result = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
    return decodeURIComponent(result);
}
var merchant_user_id = $.urlParam('_merchant_user_id_'),
    shopUserId = $.urlParam('shopUserId');

var ajaxUrl = {
    businessType:"//enterprise.qbao.com/merchantUser/toShopFinishNew.html",
    getShopInfo:"//enterprise.qbao.com/merchant/shop/qry/getShopFrontPageInfo.html",
    getNewProducts:"//enterprise.qbao.com/merchant//shop/qry/getNewProducts.html",      //上新
    upload:"//enterprise.qbao.com/qiniu/image/upload.html",
    coverBusi:"//enterprise.qbao.com/company/merchant/shop/cover/update.html",  //企业商家封面更新
    coverIndividual:"//enterprise.qbao.com/cooperatorShop/decoration/updateShopImg.html",   //个人商家封面更新
    merchantUpdate:"//enterprise.qbao.com/company/merchant/shop/logo/update.html",  //企业商家图片更新
    updateShopImg:"//enterprise.qbao.com/cooperatorShop/decoration/updateShopImg.html", //个人商家图片更新
    getShopLogoApply:"//enterprise.qbao.com/cooperatorShop/decoration/getShopLogoApply.html",   //个人商家logo审核状态
    getMerchantHaveTag:"//enterprise.qbao.com/merchant/shop/qry/getMerchantHaveTag.html",
    getSwitch:"//enterprise.qbao.com/merchant/shop/qry/getProductsCategoryV2.html",     //查询商品分类展示状态
    switchProductsCategory:"//enterprise.qbao.com/merchant/shop/qry/switchProductsCategory.html",   //设置商品分类展示状态
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

$.ajax({    //全部商品
    url: ajaxUrl.getShowGoodsList+'?pageSize=10&pageNo=&supName=&catId=',
    type:'post',
    dataType: 'jsonp',
    jsonp: 'jsonpCallback', 
    success: function(data){
        if(data.success){
            $('.allGoodsNumber').text(data.data.totalCount)
        }else{
            errorTip(data.message);
        }
    },
    error: function(xhr, type){
    }
});

var postData = {    //上新
    'shopUserId': shopUserId,
}
$.ajax({
    url: ajaxUrl.getNewProducts,
    type: "POST",
    dataType: "json",
    data:postData,
    success: function(data){
        if ( data.success ) {
            $(".newGoodsNumber").text(data.data.totalCount);
        }else{
            errorTip( data.message )
        }
    },
    error: function(xhr, type){
    }
});

var appObj = {
    rzfalse:false,
    fsfalse:false,
    setDecorate:function(){
        var postData = {
            'type': '2',
        }
        $.ajax({
            url: ajaxUrl.decorateData,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    var data = JSON.parse(data.data.data).appModualId.split(","),arrCommodity = [],
                        numWin = 0,numCommodity = 0,numSelling = 0,numBanner = 0,numSinglePic = 0,numDoublePic = 0;
                    for( var i=0;i<data.length;i++ ){
                        if ( data[i].substring(0,1) == "1" ) { //橱窗推荐
                            var str = '';
                            numWin++;
                            str = '<div class="winRecExh column showModule" id="1-1">'+
                                    '<p>橱窗推荐</p>'+
                                    '<ul>'+
                                        '<p>橱窗推荐<br />该模块无数据将不在店铺中展示</p>'+
                                    '</ul>'+
                                    '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                                '</div>';
                            $(".gridly").append( str );
                            $(".leftWin").find('.listNum span').text( numWin );
                        }else if ( data[i].substring(0,1) == "2" ) {   //商品推荐
                            var str = '';
                            numCommodity++;
                            str = '<div class="goodsRecExh column showModule" id="'+ data[i] +'">'+
                                    '<p>商品推荐</p>'+
                                    '<ul>'+
                                        '<p>商品推荐<br />该模块无数据将不在店铺中展示</p>'+
                                    '</ul>'+
                                    '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                                '</div>';
                            $(".gridly").append( str );
                            $(".addCommodity").attr("comModuleId", $(".addCommodity").attr("comModuleId")+"2-"+(numCommodity)+"," );
                            $(".leftCommodity").find('.listNum span').text( numCommodity );
                            appObj.comGoodsGetFn(data[i],'');
                        }else if ( data[i].substring(0,1) == "3" ) {   //热销商品
                            var str = '';
                            numSelling++;
                            str = '<div class="sellingExh column showModule" id="3-1">'+
                                    '<p>热销商品</p>'+
                                    '<ul>'+
                                        '<p>热销商品<br />该模块无数据将不在店铺中展示</p>'+
                                    '</ul>'+
                                    '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                                '</div>';
                            $(".gridly").append( str );
                            $(".leftSelling").find('.listNum span').text( numSelling );
                        }else if ( data[i].substring(0,1) == "4" ) {     //banner
                            var str = '';
                            numBanner++;
                            str = '<div class="banner showModule" id="4-1">'+
                                '<div class="banner-container">'+
                                    '<div class="swiper-wrapper banner-wrapper">'+
                                        '<img src="/shopDecorate/images/appBannerBr.png">'+
                                    '</div>'+
                                    '<div class="swiper-pagination"></div>'+
                                '</div>'+
                                '<div class="ope" style="display: none;"><div class="del"><span></span></div></div>'+
                            '</div>';
                            $(str).insertAfter(".coupon");
                            appObj.headInfoFn();
                            $(".leftBanner").find('.listNum span').text( numBanner );
                        }else if ( data[i].substring(0,1) == "5" ) {  //单排图片
                            var str = '';
                            numSinglePic++;
                            str = '<div class="single column showModule" id="'+ data[i] +'">'+
                                '<div class="moudleWrap">'+
                                    '<img src="/shopDecorate/images/appSinglePic.jpg" class="default">'+
                                '</div>'+
                                '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                            '</div>';
                            $(".gridly").append( str );
                            $(".addSinglePic").attr("singleModuleId", $(".addSinglePic").attr("singleModuleId")+"5-"+(numSinglePic)+"," );
                            $(".leftSingle").find('.listNum span').text( numSinglePic );
                            appObj.moudlePicGet(data[i], 'single');
                        }else if ( data[i].substring(0,1) == "6" ) {  //双排图片
                            var str = '';
                            numDoublePic++;
                            str = '<div class="double column showModule" id="'+ data[i] +'">'+
                                    '<div class="moudleWrap">'+
                                        '<img src="/shopDecorate/images/appDoublePic.jpg" class="default" style="width: 100%; display: block;">'+
                                    '</div>'+
                                    '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                                '</div>';
                            $(".gridly").append( str );
                            $(".addDoublePic").attr("doubleModuleId", $(".addDoublePic").attr("doubleModuleId")+"6-"+(numDoublePic)+"," );
                            $(".addDoublePic").find('.listNum span').text( numDoublePic );
                            appObj.moudlePicGet(data[i], 'double');
                        }
                    }
                    
                    appObj.getWindowGoods();
                    appObj.getSellingGoods();
                    moveOpe();
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
    headInfoFn:function(){
        var postData = {
            'display': '2',
            'shopUserId': shopUserId,
        }
        $.ajax({
            url: ajaxUrl.getShopInfo,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    appObj.fsfalse = data.data.falseOnePenaltyTen == 1;    //  1 是参与假一罚十    
                    appObj.rzfalse = data.data.certifyType == 1;           //  0 未认证  1已经认证  
                    appObj.setHeadFn(data.data)
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
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
    },
    setHeadFn:function(data){
        $(".logo img,.scD img").attr("src", data.logo);
        $(".headWrap>p").text( data.shopName );
        $(".sisA").css("display", ( data.certifyType == '1'?"inline-block":"none" ));
        if ( data.merchantType == 2 ) {
            $(".sisB").text('企业');
        }else{
            $(".sisB").text('个人');
        }
        $(".sisC").css("display", ( data.merchantDistStatus == '1'?"inline-block":"none" ));
        $(".thumbsNum span").text( data.thumbsCount );
        $(".head").css({
            "background":"url("+data.cover+")",
            "background-size":"100% 100%"
        })

        //banner
        var bannerData = data.displayBanners,str = '';
        if ( bannerData.length == 0 ) {
            $('.banner-container .banner-wrapper').empty().append('<div class="swiper-slide"><img class="scroll-img" src="//enterprise.qbao.com/shopDecorate/images/appBannerBr.png"></div>')
            $(".carouselWrap").empty().append('<p style="color:#ccc; text-align:center; margin-top:20px;">暂无数据</p>');
            return;
        }
        editBannerFn(bannerData);
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
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
        });
    },
    saveBanner:function(id, imgPath, goodsId){
        var postData = {
            'id': id,
            'imgPath': imgPath,
            'goodsId': goodsId,
            'display': '2'
        }
        $.ajax({
            url: ($(".businessType").text() == '0'?ajaxUrl.updateShopBannerBatch:ajaxUrl.updateBatch),
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    $(".blackBg,.cDialog").hide()
                    appObj.headInfoFn();
                    successTip(data.message);
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
            'display': '2'
        }
        $.ajax({
            url: ($(".businessType").text() == '0'?ajaxUrl.delBanner:ajaxUrl.bannerDel),
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    tar.parent().parent().remove();
                    $(".carousel .moduleNum").text( $(".carouselWrap .onePic").length );
                    appObj.headInfoFn();
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
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
    delWindowGoods:function(tar, goodsid){
        $.ajax({
            url:ajaxUrl.deleteShowWindowGoods+'?spuId='+ goodsid +'&source=1',
            type:'post', 
            dataType:'jsonp',
            jsonp: 'jsonpCallback',
            success:function(data){
                if(data.success){
                    tar.parents('.goodsRecWrap').siblings(".addGoods").find(".moduleNum").text( tar.parent().parent().find("li").length-1 );
                    tar.parent().remove();
                }else{
                    errorTip(data.message);
                }
            },
            error:function(){
            }
        });
    },
    saveWindow:function(spuIds, from){
        $.ajax({
            url:ajaxUrl.setShowWindowGoods+'?userId='+ shopUserId +'&spuIds=' +spuIds+'&source=1',
            type:'post',
            dataType:'jsonp',
            jsonp: 'jsonpCallback',
            success:function(data){
                if ( data.success ) {
                    $(".dialog,.blackBg").hide();
                    appObj.getWindowGoods(from);
                }else{
                    errorTip(data.message);
                }
            },
            error:function(){
                 errorTip("网络错误，请重试");
            }
        });
    },
    getWindowGoods:function(from){
        $.ajax({
            url:ajaxUrl.getShowWindowGoods+'?userId='+ shopUserId +'&source=1',
            type:'post',
            dataType:'jsonp',
            jsonp: 'jsonpCallback',
            success:function(data){
              var _data = data.data;
              if ( from == 'dialog' ) {
                var html = '';
                if ( _data.length == 0 ) {
                    $('.winRecWrap ul').empty().append('暂无数据');
                    return;
                  }
                  for(var i=0; i<_data.length; i++){
                    html += '<li class="winRecList" goodsId="'+ _data[i].id +'">'+
                            '<img src="'+ _data[i].mainImg +'">'+
                            '<p class="proName" style="display:none;">'+ _data[i].spuName +'</p>'+
                            '<span style="display:none;">¥'+ (_data[i].viewPrice/100).toFixed(2) +'</span>'+
                            '<div class="goodsDel"><span></span></div>'+
                        '</li>';
                  }
                  $('.winRecWrap ul').empty().append(html);
                  $(".winRec .moduleNum").text( $('.winRecWrap ul').find('li').length );
                  if ( $('.winRecWrap ul').find('li').length == 4 ) {
                    $('.winRec .addGoods p').text('修改商品');
                  }else{
                    $('.winRec .addGoods p').text('添加商品');
                  }
                  moveOpe()
              }else{
                var html = '';
                if ( _data.length == 0 ) {
                    $('.winRecExh ul').empty().append('<p>橱窗推荐<br />该模块无数据将不在店铺中展示</p>');
                    $('.winRecExh>p').hide();
                    return;
                }
                $('.winRecExh>p').show();
                for(var i=0; i<_data.length; i++){
                    html += '<li class="winRecExhList" goodsId="'+ _data[i].id +'">'+
                        '<div class="proImg"><img src="'+ _data[i].mainImg + '"/></div>'+
                        '<p class="proName">'+    (_data[i].spuName.length>17?_data[i].spuName.substring(0,17)+"...":_data[i].spuName) +'</p>'+
                        '<div class="goodsInfoWrap">'+
                            '<span class="goodsPrice"><em>¥</em>'+ (_data[i].viewPrice/100).toFixed(0) +'.</span><em>'+ (_data[i].viewPrice/100).toFixed(2).substr(-2) +'</em>'+
                            (appObj.rzfalse?'<span class="voucher">券</span>':'')+
                            (appObj.fsfalse?'<span class="penalty">罚</span>':'')+
                        '</div>'+
                        '</li>';
                }
                $('.winRecExh ul').empty().append(html);
              }
            },
            error:function(){
                errorTip("网络错误，请重试");
            }
          });
    },
    comGoodsSaveFn:function( modualId, goodsId, comGoodsTit, from ){    //商品推荐保存
        var postData = {
            "type": "2",
            "modualId": modualId,
            "data": '{"goodsId":"'+goodsId+'","comGoodsTit":"'+comGoodsTit+'" }'
        }
        $.ajax({
            url: ajaxUrl.publicSave,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    $(".dialog,.blackBg").hide();
                    successTip(data.message);
                    appObj.comGoodsGetFn(modualId, from);
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
    comGoodsGetFn:function(modualId, from){
        var postData = {
            "type": "2",
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
                    $(".goodsRecExh>p").text( ( JSON.parse(data.data[0].data).comGoodsTit == ''?'商品推荐':JSON.parse(data.data[0].data).comGoodsTit ) );
                    var modualId = data.data[0].modualId;
                    appObj.comGoodsListFn(data, modualId, from);
                }else{
                    errorTip( data.message );
                }
            },
            error: function(xhr, type){
            }
        });
    },
    comGoodsListFn:function(data, modualId, from){
        $.ajax({
            url:ajaxUrl.comGoodsDetail+'?ids=['+ JSON.parse(data.data[0].data).goodsId +']',
            type:'post',
            dataType:'jsonp',
            jsonp:'callback',
            success:function(data){
              var _data = data.data;
              if ( from == 'dialog' ) {
                var html = '';
                if ( _data.length == 0 ) {
                    $('.goodsRecWrap ul').empty().append('暂无数据');
                    return;
                  }
                  for(var i=0; i<_data.length; i++){
                    html += '<li class="goodsRecList" goodsId="'+ _data[i].id +'">'+
                            '<img src="'+ _data[i].mainImg +'">'+
                            '<p class="proName" style="display:none;">'+ _data[i].spuName +'</p>'+
                            '<span style="display:none;">¥'+ (_data[i].viewPrice/100).toFixed(2) +'</span>'+
                            '<div class="goodsDel"><span></span></div>'+
                        '</li>';
                  }
                  $('.goodsRecWrap ul').empty().append(html);
                  $(".goodsRec .moduleNum").text( $('.goodsRecWrap ul').find('li').length );
                  if ( $('.goodsRecWrap ul').find('li').length == 4 ) {
                    $('.goodsRec .addGoods p').text('修改商品');
                  }else{
                    $('.goodsRec .addGoods p').text('添加商品');
                  }
                  moveOpe();
              }else{
                for( var b=0;b<$(".goodsRecExh").length;b++ ){
                    if ( $(".goodsRecExh").eq(b).attr("id") == modualId ) {
                        var html = '',dom = $(".goodsRecExh").eq(b);
                        if ( _data.length == 0 ) {
                            dom.find('ul').empty().append('<p>商品推荐<br />该模块无数据将不在店铺中展示</p>');
                            dom.children("p").hide();
                            return;
                        }
                        dom.children("p").show();
                        for(var i=0; i<_data.length; i++){
                            html += '<li class="goodsRecExhList" goodsId="'+ _data[i].id +'">'+
                                '<div class="proImg"><img src="'+ _data[i].mainImg + '"/></div>'+
                                '<p class="proName">'+ (_data[i].spuName.length>17?_data[i].spuName.substring(0,17)+"...":_data[i].spuName) +'</p>'+
                                '<div class="goodsInfoWrap">'+
                                    '<span class="goodsPrice"><em>¥</em>'+ ((_data[i].priceF).replace(/,/g,"")/100).toFixed(0) +'.</span><em>'+ ((_data[i].priceF).replace(/,/g,"")/100).toFixed(2).substr(-2) +'</em>'+
                                    (appObj.rzfalse?'<span class="voucher">券</span>':'')+
                                    (appObj.fsfalse?'<span class="penalty">罚</span>':'')+
                                    '<p>已售<span>'+_data[i].salesNumAggregated+'</span></p>'+
                                '</div>'+
                                '</li>';
                        }
                        dom.find('ul').empty().append(html);
                    }
                }
              }
            },
            error:function(){
            }
          });
    },
    moudleSave:function(modualId, size, imgPath, goodsId, goodsSrc, from){
        var postData = {
            "type": "2",
            "modualId": modualId,
            "data": '{"size":"'+ size +'","imgPath":"'+ imgPath +'","goodsId":"'+ goodsId +'","goodsSrc":"'+ goodsSrc +'" }'
        }
        $.ajax({
            url: ajaxUrl.publicSave,
            type: "POST",
            dataType: "json",
            data:postData,
            success: function(data){
                if ( data.success ) {
                    $(".dialog,.blackBg").hide();
                    appObj.moudlePicGet(modualId, from);
                    successTip(data.message);
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
    moudlePicGet:function(modualId, from){
        var postData = {
            "type": "2",
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
                    if ( from == 'single' ) {
                        for( var i=0;i<$(".single").length;i++ ){
                            for( var b=0;b<data.data.length;b++ ){
                                if ( $(".single").eq(i).attr("id") == data.data[b].modualId ) {
                                    var dom = $(".single").eq(i).find(".moudleWrap"),
                                        _data = JSON.parse(data.data[b].data), str = '';
                                    for( var m=0;m<_data.imgPath.split(",").length;m++ ){
                                        if ( _data.size.split(",")[m] == '1' ) {
                                            str += '<img src="'+ _data.imgPath.split(",")[m] +'" style="height:176px;" size="'+ _data.size.split(",")[m] +'" goodsId="'+ _data.goodsId.split(",")[m] +'" goodsSrc="'+ _data.goodsSrc.split(",")[m] +'">'
                                        }else{
                                            str += '<img src="'+ _data.imgPath.split(",")[m] +'" style="height:88px;" size="'+ _data.size.split(",")[m] +'" goodsId="'+ _data.goodsId.split(",")[m] +'" goodsSrc="'+ _data.goodsSrc.split(",")[m] +'">'
                                        }
                                    }
                                    dom.empty().append( str );
                                }
                            }
                        }
                    }else if ( from == 'double' ) {
                        for( var i=0;i<$(".double").length;i++ ){
                            for( var b=0;b<data.data.length;b++ ){
                                if ( $(".double").eq(i).attr("id") == data.data[b].modualId ) {
                                    var dom = $(".double").eq(i).find(".moudleWrap"),
                                        _data = JSON.parse(data.data[b].data), str = '';
                                    for( var m=0;m<_data.imgPath.split(",").length;m++ ){
                                        str += '<img src="'+ _data.imgPath.split(",")[m] +'" '+ ( _data.imgPath.split(",")[m] == ''?"style='visibility:hidden;'":"" ) +' goodsId="'+ _data.goodsId.split(",")[m] +'" goodsSrc="'+ _data.goodsSrc.split(",")[m] +'">'
                                    }
                                    dom.empty().append( str );
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
                        $('.sellingExh ul').empty().append('<p>热销商品<br />该模块无数据将不在店铺中展示</p>');
                        $('.sellingExh>p').hide();
                        return;
                    }
                    $('.sellingExh>p').show();
                    for(var i=0; i<_data.length; i++){
                        html += '<li class="winRecExhList" goodsId="'+ _data[i].id +'">'+
                        '<div class="proImg"><img src="'+ _data[i].mainImg + '"/></div>'+
                        '<p class="proName">'+ (_data[i].spuName.length>17?_data[i].spuName.substring(0,17)+"...":_data[i].spuName) +'</p>'+
                        '<div class="goodsInfoWrap">'+
                            '<span class="goodsPrice"><em>¥</em>'+ Number(_data[i].viewPriceYuan).toFixed(0) +'.</span><em>'+ Number(_data[i].viewPriceYuan).toFixed(2).substr(-2) +'</em>'+
                            (appObj.rzfalse ?'<span class="voucher">券</span>':'')+
                            (appObj.fsfalse?'<span class="penalty">罚</span>':'')+
                            '<p>已售<span>'+_data[i].salesNumAggregated+'</span></p>'+
                          '</div>'+
                        '</li>';
                    }
                    $('.sellingExh ul').empty().append(html);
                }else{
                    errorTip( data.message )
                }
            },
            error: function(xhr, type){
            }
        });
    },
    uploadPic:function(obj, name, fn, cover){   //图片上传
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
                        'display': '2'
                    }
                }else{
                    postData = {
                        'cover': data.result.data.imageUrl,
                        'display': '2'
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
            "type": "2",
            "data": '{"pcModualId":"'+ lengthReduce(localStorage.getItem('pcModualId')) +'","appModualId":"'+ modualId +'"}'
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

appObj.setDecorate();
appObj.headInfoFn();
appObj.headInfoFn();
appObj.uploadPic($("#filedataCover"), "newCover", function(data){    //店招
    $(".uploadCoverWrap>img").attr("src", data.result.data.imageUrl);
}, "cover")
appObj.uploadPic($(".carouselWrap #filedataBanner"), 'newBanner', function(data){
    $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
})
appObj.uploadPic($(".singleWrap #filedataSingle"), 'newSingle', function(data){
    $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
})
appObj.uploadPic($(".doubleAddPic #filedataDouble1"), 'newDouble1', function(data){
    $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
})
appObj.uploadPic($(".doubleAddPic #filedataDouble2"), 'newDouble2', function(data){
    $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
})

$(".useDefaultCover").on("click",function(){
    $(".uploadCoverWrap img").attr('src', '/shopDecorate/images/headBg.jpg');
    var postData = {
        'cover': "//enterprise.qbao.com/shopDecorate/images/headBg.jpg",
        'display': '2'
    }
    $.ajax({ 
        url: ($(".businessType").text() == '0'?ajaxUrl.coverIndividual:ajaxUrl.coverBusi),
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

function PageCallback(page_index, jq){         
    nextPage = page_index+1;
    appObj.getGoods('', '', nextPage);
}

$(".releaseBtn").on("click",function(){ //发布
    var modualId = '';
    if ( $('.banner').attr("id") != undefined ) {
        modualId = $('.banner').attr("id")+',';
    }
    for( var i=0;i<$(".gridly").find(".column").length;i++ ){
        modualId += $(".gridly").find(".column").eq(i).attr("id")+",";
    }
    localStorage.setItem('appModualId',modualId);
    appObj.submitFn( lengthReduce(modualId) );
})

$(".mainTab").on("click","p",function(){
    $(this).addClass("tabActive");
    $(this).siblings("p").removeClass('tabActive');
    $(".tabChoose").css({
        'left':( $(this).index()==0?"540px":"640px" )
    })
    if ( $(this).index() == 0 ) {
        var modualId = '';
        if ( $('.banner').attr("id") != undefined ) {
            modualId = $('.banner').attr("id")+',';
        }
        for( var i=0;i<$(".gridly").find(".column").length;i++ ){
            modualId += $(".gridly").find(".column").eq(i).attr("id")+",";
        }
        localStorage.setItem('appModualId',modualId);
    	window.location.href = '//enterprise.qbao.com/shopDecorate/pcDecorate.htm?q_sellerUserId='+shopUserId+'&_merchant_user_id_='+merchant_user_id;
    }
})

$( ".gridly" ).sortable({
    revert: true
});

$(".scConfirm").on("click",function(){
    var _this = $(this);
    if ( _this.parent().siblings(".scA").text() == "店铺头部" ) {
        appObj.headInfoFn()
    }else if ( _this.parent().siblings(".scA").text() == "轮播图" ) {
        var id = '', imgPath='', goodsId='', dom='';
        for( var i=0;i<$(".carouselWrap .onePic").length;i++ ){
            dom = $(".carouselWrap .onePic").eq(i);
            id += dom.attr('dataid')+',';
            imgPath += dom.find(".carouselAddPic img").attr("src")+',';
            goodsId += dom.find(".relatedCom").attr("goodsid")+',';
        }
        if ( lengthReduce(goodsId).split(',').length > 1 ) {
            for( var b=0;b<lengthReduce(goodsId).split(',').length;b++ ){
                if ( goodsId.split(',')[b] == "" ) {
                    errorTip("轮播图必须关联商品");
                    return;
                }
            }
        }
        appObj.saveBanner(lengthReduce(id), lengthReduce(imgPath), lengthReduce(goodsId));
    }else if ( _this.parent().siblings(".scA").text() == "单排图片" ) {
        var modualId = _this.parent().parent().attr("moudleId"), size='', imgPath='', goodsId='', goodsSrc='', dom='', from="single";
        for( var i=0;i<$(".singleWrap .onePic").length;i++ ){
            dom = $(".singleWrap .onePic").eq(i);
            size += (dom.find(".asA li").eq(0).attr("choose") == 'true'?"1":"2")+",";
            imgPath += dom.find(".singleAddPic img").attr("src")+",";
            goodsId += dom.find(".relatedCom").attr("goodsid")+",";
            goodsSrc += dom.find(".relatedCom img").attr("src")+",";
        }
        if ( lengthReduce(imgPath) == '' ) {
            errorTip('请上传单排图片');
            return;
        }
        appObj.moudleSave(modualId, lengthReduce(size), lengthReduce(imgPath), lengthReduce(goodsId), lengthReduce(goodsSrc), from);
    }else if ( _this.parent().siblings(".scA").text() == "双排图片" ) {
        var modualId = _this.parent().parent().attr("moudleId"), size='', imgPath='', goodsId='', goodsSrc='', dom='',from="double";
        for( var i=0;i<$(".doubleWrap .onePic").length;i++ ){
            dom = $(".doubleWrap .onePic").eq(i);
            imgPath += dom.find(".doubleAddPic img").attr("src")+",";
            goodsId += dom.find(".relatedCom").attr("goodsid")+",";
            goodsSrc += dom.find(".relatedCom img").attr("src")+",";
        }
        if ( lengthReduce(imgPath) == '' ) {
            errorTip('请上传双排图片');
            return;
        }
        appObj.moudleSave(modualId, size, lengthReduce(imgPath), lengthReduce(goodsId), lengthReduce(goodsSrc), from);
    }else if ( _this.parent().siblings(".grA").text() == "橱窗推荐" ) {
        appObj.getWindowGoods();
    }else if ( _this.parent().siblings(".grA").text() == "商品推荐" ) {
        var modualId = _this.parent().parent().attr('moudleId'),
            goodsId = '',
            from = "",
            comGoodsTit = $('.goodsTit').val();
        for( var i=0;i<$(".goodsRecWrap ul").find("li").length;i++ ){
            goodsId += $(".goodsRecWrap ul").find("li").eq(i).attr('goodsid')+','
        }

        appObj.comGoodsSaveFn(modualId, lengthReduce(goodsId), comGoodsTit, from);
    }
})

$(".singleWrap").on("click","li",function(){
    var _this = $(this);
    _this.find("img").attr("src","/shopDecorate/images/radioChoose.png");
    _this.attr("choose","true");
    _this.siblings("li").attr("choose","false");
    _this.siblings("li").find("img").attr("src","/shopDecorate/images/radioQuit.png");
    if ( _this.index() == 0 ) {
        _this.parent().siblings('.singlePicTip').find("span").text("300");
        _this.parent().siblings(".singleAddPic").css({
            'height': '80px'
        })
        _this.parent().siblings(".singleAddPic").find("*").css({
            'height': '80px',
            'line-height': '80px'
        })
    }else{
        _this.parent().siblings('.singlePicTip').find("span").text("220");
        _this.parent().siblings(".singleAddPic").css({
            'height': '58px'
        })
        _this.parent().siblings(".singleAddPic").find("*").css({
            'height': '58px',
            'line-height': '58px'
        })
    }
})

function moveOpe(){
    $(".column").hover(function(){
        $(this).find(".ope").show();
    },function(){
        $(this).find(".ope").hide();
    })
    $(".banner").hover(function(){
        $(this).find(".ope").show();
    },function(){
        $(this).find(".ope").hide();
    })
    $(".winRecList").hover(function(){
        $(this).find(".goodsDel").show();
    },function(){
        $(this).find(".goodsDel").hide();
    })
    $(".goodsRecList").hover(function(){
        $(this).find(".goodsDel").show();
    },function(){
        $(this).find(".goodsDel").hide();
    })
    $( ".gridly" ).sortable({
        revert: true
    });

}
$('body').on("click",".ope div",function(){
    var _this = $(this), $dom = _this.parent().parent();
    if ( _this.parent().hasClass("carouselOpe") ) {
        var id = _this.parent().parent().attr("dataid");
        appObj.delBannerFn(_this, id);
        return;
    }
    if ( _this.parent().hasClass("singleOpe") ) {
        if ( _this.hasClass('up') ) {
            $dom.insertBefore($dom.prev());
        }else if ( _this.hasClass("down") ) {
            $dom.insertAfter($dom.next());
        }else if ( _this.hasClass("del") ) {
            _this.parent().parent().remove();
            $(".addSingle .moduleNum").text($(".singleWrap").find(".singleOne").length);
        }
        return;
    }
    if ( _this.hasClass("up") ) {
        $dom.insertBefore($dom.prev());
    }else if ( _this.hasClass("down") ) {
        $dom.insertAfter($dom.next());
    }else if ( _this.hasClass("del") ){
        if ( _this.parent().parent().hasClass("banner") ) {
            _this.parents(".banner").remove();
            $(".leftBanner .listNum span").text( $(".banner").length );
        }else if ( _this.parents(".column").hasClass("goodsRecExh") ) {
            _this.parents(".column").remove();
            $(".leftCommodity .listNum span").text( $(".goodsRecExh").length );
        }else if ( _this.parents(".column").hasClass("winRecExh") ) {
            _this.parents(".column").remove();
            $(".leftWin .listNum span").text( $(".winRecExh").length );
        }else if ( _this.parents(".column").hasClass("sellingExh") ) {
            _this.parents(".column").remove();
            $(".leftSelling .listNum span").text( $(".sellingExh").length );
        }else if ( _this.parents(".column").hasClass("single") ) {
            _this.parents(".column").remove();
            $(".leftSingle .listNum span").text( $(".single").length );
        }else if ( _this.parents(".column").hasClass("double") ) {
            _this.parents(".column").remove();
            $(".leftDouble .listNum span").text( $(".double").length );
        }
        
    }
})
$(".mid").on("click",".showModule",function(){
    var _this = $(this);
    $(".showModule").css({
        'border':'1px solid #fff',
        'box-shadow': 'none'
    })
    _this.css({
        'border':'1px solid #ff9600',
        'box-shadow': '0 2px 4px #ffd190'
    })
    $(".moduleMain").hide();
    if ( _this.hasClass("head") ) {
        $(".setCover").attr("moudleId", _this.attr("id")).show();
    }else if ( _this.hasClass("goodsRecExh") ) {    //商品推荐
        $(".goodsRec").attr("moudleId", _this.attr("id")).show();
        if ( _this.find('ul li').length == 0 ) {
            $(".goodsRecWrap ul").empty().append("暂无数据");
            $(".goodsRec .moduleNum").text("0");
            return;
        }
        appObj.comGoodsGetFn(_this.attr("id"), "dialog");
    }else if ( _this.hasClass("winRecExh") ) {  //橱窗推荐
        $(".winRec").attr("moudleId", _this.attr("id")).show();
        appObj.getWindowGoods("dialog");
    }else if ( _this.hasClass("banner") ) {
        $(".carousel").attr("moudleId", _this.attr("id")).show();
    }else if ( _this.hasClass("single") ) {
        $(".addSingle").attr("moudleId", _this.attr("id")).show();
        $(".singleWrap").empty();
        if ( _this.find(".default").length == 1 ) {
            $(".addSingle .moduleNum").text("0");
            return;
        }
        for( var i=0;i<_this.find(".moudleWrap img").length;i++ ){
            var dom1 = _this.find(".moudleWrap img").eq(i);
            var str = '<div class="singleOne onePic">'+
                '<p class="subtitle">图片尺寸</p>'+
                '<ul class="asA">'+
                    '<li style="margin-right: 50px;" choose="'+ (dom1.attr("size") == '1'?'true':'false') +'">'+
                        '<img src="'+ (dom1.attr("size") == '1'?'/shopDecorate/images/radioChoose.png':'/shopDecorate/images/radioQuit.png') +'">'+
                        '<p>大图</p>'+
                    '</li>'+
                    '<li choose="'+ (dom1.attr("size") == '2'?'true':'false') +'">'+
                        '<img src="'+ (dom1.attr("size") == '2'?'/shopDecorate/images/radioChoose.png':'/shopDecorate/images/radioQuit.png') +'">'+
                        '<p>小图</p>'+
                    '</li>'+
                '</ul>'+
                '<p class="subtitle">图片</p>'+
                '<div class="singleAddPic moduleAddPic">'+
                    '<img src="'+ dom1.attr('src') +'">'+
                    '<div>'+
                        '<p>添加图片</p>'+
                        '<input type="file" name="newSingle'+ i +'" id="filedataSingle'+ i +'">'+
                    '</div>'+
                '</div>'+
                '<div class="ope singleOpe"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                '<p class="scC singlePicTip">建议尺寸750*<span>300</span>，类型jpg、png</p>'+
                '<p class="subtitle">链接商品</p>'+
                '<div class="relatedCom singleRelatedCom" goodsId="'+ dom1.attr("goodsid") +'" style="display: inline-block;">'+
                    '<img src=" '+ dom1.attr('goodssrc') +'">'+
                    '<div></div>'+
                    '<p class="g" seleId="">链接商品</p>'+
                '</div>'+
            '</div>';
        $(".singleWrap").append(str);
        moveOpe();
        onePicHover();
        appObj.uploadPic($(".singleWrap #filedataSingle"+ i ), 'newSingle'+ i, function(data){
            $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
        })
        $(".addSingle").find(".moduleNum").text( $(".singleWrap").find(".onePic").length );
        }
    }else if ( _this.hasClass("double") ) {
        $(".addDouble").attr("moudleId", _this.attr("id")).show(); 
        if ( _this.find(".default").length == 1 ) {
            $('.doubleAddPic img').attr("src",'');
            $(".doubleRelatedCom").attr("goodsId",'').find("img").attr("src",'/shopDecorate/images/bannerBr.jpg');
            return;
        }
        var str = '', dom = '';
        $(".doubleWrap").empty();
        for( var i=0;i<_this.find(".moudleWrap img").length;i++ ){
            dom = _this.find(".moudleWrap img").eq(i);
            str = '<div class="onePic">'+
                '<p class="subtitle">图片</p>'+
                '<div class="doubleAddPic moduleAddPic">'+
                    '<img src="'+ dom.attr('src') +'" >'+
                    '<div>'+
                        '<p>添加图片</p>'+
                        '<input type="file" name="newDouble'+i+'" id="filedataDouble'+i+'">'+
                    '</div>'+
                '</div>'+
                '<div class="ope doubleOpe"><div class="up"><span></span></div><div class="down"><span></span></div></div>'+
                '<p class="scC">建议尺寸345*220，类型jpg、png</p>'+
                '<p class="subtitle">链接商品</p>'+
                '<div class="relatedCom doubleRelatedCom" style="display: inline-block;" goodsId="'+ dom.attr("goodsId") +'">'+
                    '<img src="'+ dom.attr("goodsSrc") +'">'+
                    '<div></div>'+
                    '<p class="g" seleId="0">链接商品</p>'+
                '</div>'+
            '</div>';
        $(".doubleWrap").append(str);
        appObj.uploadPic($(".doubleWrap #filedataDouble"+ i ), 'newDouble'+ i, function(data){
            $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
        })
        moveOpe();
        onePicHover();
        }
    }
})

var comNum = 1,singleNum = 1,doubleNum = 1,wordNum = 0,bannerNum = 0;
$(".addModular").on("click",function(){     
    if ( $(this).hasClass('addWin') ) {     //橱窗推荐
        if ( $(".winRecExh").length > 0 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="winRecExh column showModule" id="1-1" style="border:1px solid #ff9600; box-shadow: 0 2px 4px #ffd190;">'+
                '<p>橱窗推荐</p>'+
                '<ul>'+
                    '<p>橱窗推荐<br />该模块无数据将不在店铺中展示</p>'+
                '</ul>'+
                '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
            '</div>';
        $(".showModule").css({
            'border':'1px solid #fff',
            'box-shadow': 'none'
        })
        $(".gridly").append(str);
        $(this).siblings(".listNum").find("span").text( $(".winRecExh").length );
        moveOpe();
        window.scrollTo(0, $(".winRecExh").eq($(".winRecExh").length-1).offset().top-140 );
        $(".moduleMain").hide();
        $('.winRec').attr("moudleid", '1-'+ $(this).siblings(".listNum").find("span").text()).show();
        $(".winRecWrap ul").empty().append("暂无数据");
        $(".goodsRec .moduleNum").text("0");
    }else if ( $(this).hasClass('addSelling') ) {     //热销商品
        if ( $(".sellingExh").length > 0 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="sellingExh column showModule" id="3-1" style="border:1px solid #ff9600; box-shadow: 0 2px 4px #ffd190;">'+
                '<p>热销商品</p>'+
                '<ul>'+
                    '<p>热销商品<br />该模块无数据将不在店铺中展示</p>'+
                '</ul>'+
                '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
            '</div>';
        $(".showModule").css({
            'border':'1px solid #fff',
            'box-shadow': 'none'
        })
        $(".gridly").append(str);
        appObj.getSellingGoods();
        $(this).siblings(".listNum").find("span").text( $(".sellingExh").length );
        moveOpe();
        window.scrollTo(0, $(".sellingExh").eq($(".sellingExh").length-1).offset().top-140 );
        $(".moduleMain").hide();
    }else if ( $(this).hasClass('addCommodity') ) {     //商品推荐
        if ( $(".goodsRecExh").length > 4 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="goodsRecExh column showModule" id="2-'+ (Number($(this).siblings(".listNum").find("span").text())+1) +'" style="border:1px solid #ff9600; box-shadow: 0 2px 4px #ffd190;">'+
                '<p>商品推荐</p>'+
                '<ul>'+
                    '<p>商品推荐<br />该模块无数据将不在店铺中展示</p>'+
                '</ul>'+
                '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
            '</div>';
        $(".showModule").css({
            'border':'1px solid #fff',
            'box-shadow': 'none'
        })
        $(".gridly").append(str);
        $(this).siblings(".listNum").find("span").text( $(".goodsRecExh").length );
        moveOpe();
        window.scrollTo(0, $(".goodsRecExh").eq($(".goodsRecExh").length-1).offset().top-140 );
        $(".moduleMain").hide();
        $('.goodsRec').attr("moudleid", '2-'+ $(this).siblings(".listNum").find("span").text()).show();
        $(".goodsRecWrap ul").empty().append("暂无数据");
        $(".goodsRec .moduleNum").text("0");
    }else if ( $(this).hasClass('addBanner') ) {     //banner
        if ( $('.banner').length > 0 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="banner showModule" id="4-1" style="border:1px solid #ff9600; box-shadow: 0 2px 4px #ffd190;">'+
                '<div class="banner-container">'+
                    '<div class="swiper-wrapper banner-wrapper">'+
                        '<img src="/shopDecorate/images/appBannerBr.png">'+
                    '</div>'+
                    '<div class="swiper-pagination"></div>'+
                '</div>'+
                '<div class="ope" style="display: none;"><div class="del"><span></span></div></div>'+
            '</div>';
        $(str).insertAfter(".coupon");
        $(this).siblings(".listNum").find("span").text( $('.banner').length );
        $(".carousel").show();
        moveOpe();
        window.scrollTo(0, $(".banner").eq($('.banner').length-1).offset().top-140 );
        $(".moduleMain").hide();
        $('.carousel').attr("moudleid", '4-'+ $(this).siblings(".listNum").find("span").text()).show();
    }else if ( $(this).hasClass('addSinglePic') ) {     //单排图片
        if ( $(".single").length > 9 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="single column showModule" id="5-'+ (Number($(this).siblings(".listNum").find("span").text())+1) +'" style="border:1px solid #ff9600; box-shadow: 0 2px 4px #ffd190;">'+
                    '<div class="moudleWrap">'+
                        '<img src="/shopDecorate/images/appSinglePic.jpg" class="default">'+
                    '</div>'+
                    '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                '</div>';
        $(".showModule").css({
            'border':'1px solid #fff',
            'box-shadow': 'none'
        })
        $(".gridly").append(str);
        $(this).siblings(".listNum").find("span").text( $(".single").length );
        moveOpe();
        $(".singleWrap").empty();
        $(".addSingle .moduleNum").text("0");
        window.scrollTo(0, $(".single").eq($(".single").length-1).offset().top-140 );
        $(".moduleMain").hide();
        $('.addSingle').attr("moudleid", '5-'+ $(this).siblings(".listNum").find("span").text()).show();
    }else if ( $(this).hasClass('addDoublePic') ) {     //双排图片
        if ( $(".double").length > 9 ) {
            errorTip("该模块超出使用上限");
            return;
        }
        var str = '';
        str = '<div class="double column showModule" id="6-'+ (Number($(this).siblings(".listNum").find("span").text())+1) +'" style="border:1px solid #ff9600; box-shadow: 0 2px 4px #ffd190;">'+
                    '<div class="moudleWrap">'+
                        '<img src="/shopDecorate/images/appDoublePic.jpg" class="default" style="width: 100%; display: block;">'+
                    '</div>'+
                    '<div class="ope"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                '</div>';
        $(".showModule").css({
            'border':'1px solid #fff',
            'box-shadow': 'none'
        })
        $(".gridly").append(str);
        $(this).siblings(".listNum").find("span").text( $(".double").length );
        moveOpe();
        window.scrollTo(0, $(".double").eq($(".double").length-1).offset().top-140 );
        $(".moduleMain").hide();
        $('.addDouble').attr("moudleid", '6-'+ $(this).siblings(".listNum").find("span").text()).show();
        $(".doubleAddPic img").attr("src","");
        $(".doubleRelatedCom").attr("goodsId","").find("img").attr("src","/shopDecorate/images/bannerBr.jpg");
    }
})

$('.grC').on("keyup","input",function(){
    $('.grC').find("span").text( $(this).val().length );
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

$(".winTab").on("click","p",function(){
    $(this).siblings("p").removeClass("winActive").end().addClass("winActive");
    if ( $(this).index() == 0 ) {
        $(".winActiveLine").css({
            "margin-left":"0",
            "width":"53px"
        })
        $(".winMain").show();
        $(".winHasChoose").hide();
    }else{
        $(".winActiveLine").css({
            "margin-left":"101px",
            "width":"83px"
        })
        $(".winHasChoose").show();
        $(".winMain").hide();
    }
})

$(".g").on("click",function(){
    $(".blackBg,.dialog").show();
    $(".winTab").hide();
    $(".dialog").find(".title").text("关联商品");
    $(".dialog").find('.confirm').attr("seleId", $(this).attr("seleId"));
})

function editBannerFn(data){
    $(".carouselWrap").empty();
    for( var i=0;i<data.length;i++ ){
        var str = '<div class="onePic" dataId="'+ data[i].id +'">'+
                '<p class="subtitle">图片</p>'+
                '<div class="carouselAddPic moduleAddPic">'+
                    '<img src="'+ data[i].imgPath +'">'+
                    '<div>'+
                        '<p>添加图片</p>'+
                        '<input type="file" name="newBanner'+ (i+1) +'" id="filedataBanner'+ (i+1) +'">'+
                    '</div>'+
                '</div>'+
                '<div class="ope carouselOpe"><div class="del"><span></span></div></div>'+
                '<p class="scC">建议尺寸750*300，类型jpg、png</p>'+
                '<p class="subtitle">链接商品</p>'+
                '<div class="relatedCom bannerRelatedCom" goodsId="'+ data[i].goodsId +'" style="display: inline-block;">'+
                    '<img src="'+ data[i].goodsImg +'">'+
                    '<div></div>'+
                    '<p class="g" seleId="'+ (i+1) +'">链接商品</p>'+
                '</div>'+
            '</div>';
        $(".carouselWrap").append( str );
        appObj.uploadPic($(".bannerList #reuploadBannerDo"+ (i+1) ), 'reBanner'+ (i+1), function(data){
            $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
            $(".uploadBannerBtn").hide();
        })
    }
    $(".carousel .moduleNum").text( $(".carouselWrap .onePic").length );
    onePicHover();
    moveOpe();
}

$(".grD").on("click",function(){    //添加模块内项目
    var _this = $(this);
    if ( _this.siblings(".scA").text() == '轮播图' ) {
        if ( _this.find(".moduleNum").text() > 4 ) {
            return;
        }
        var str = '<div class="onePic" dataId="0">'+
                '<p class="subtitle">图片</p>'+
                '<div class="carouselAddPic moduleAddPic">'+
                    '<img src="">'+
                    '<div>'+
                        '<p>添加图片</p>'+
                        '<input type="file" name="newBanner'+ _this.find(".moduleNum").text() +'" id="filedataBanner'+ _this.find(".moduleNum").text() +'">'+
                    '</div>'+
                '</div>'+
                '<div class="ope carouselOpe"><div class="del"><span></span></div></div>'+
                '<p class="scC">建议尺寸750*300，类型jpg、png</p>'+
                '<p class="subtitle">链接商品</p>'+
                '<div class="relatedCom bannerRelatedCom" goodsId="" style="display: inline-block;">'+
                    '<img src="/shopDecorate/images/bannerBr.jpg">'+
                    '<div></div>'+
                    '<p class="g" seleId="'+ (Number(_this.find(".moduleNum").text())+1) +'">链接商品</p>'+
                '</div>'+
            '</div>';
        $(".carouselWrap>p").remove();
        $(".carouselWrap").append(str);
        onePicHover();
        appObj.uploadPic($(".carouselWrap #filedataBanner"+ _this.find(".moduleNum").text() ), 'newBanner'+ _this.find(".moduleNum").text(), function(data){
            $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
        })
        _this.find(".moduleNum").text( $(".carouselWrap").find(".onePic").length );
        moveOpe();
    }else if ( _this.siblings(".scA").text() == '单排图片' ) {
        if ( _this.find(".moduleNum").text() > 4 ) {
            return;
        }
        var str = '<div class="singleOne onePic">'+
                '<p class="subtitle">图片尺寸</p>'+
                '<ul class="asA">'+
                    '<li style="margin-right: 50px;" choose="true">'+
                        '<img src="/shopDecorate/images/radioChoose.png">'+
                        '<p>大图</p>'+
                    '</li>'+
                    '<li choose="false">'+
                        '<img src="/shopDecorate/images/radioQuit.png">'+
                        '<p>小图</p>'+
                    '</li>'+
                '</ul>'+
                '<p class="subtitle">图片</p>'+
                '<div class="singleAddPic moduleAddPic">'+
                    '<img src="">'+
                    '<div>'+
                        '<p>添加图片</p>'+
                        '<input type="file" name="newSingle'+ _this.find(".moduleNum").text() +'" id="filedataSingle'+ _this.find(".moduleNum").text() +'">'+
                    '</div>'+
                '</div>'+
                '<div class="ope singleOpe"><div class="up"><span></span></div><div class="down"><span></span></div><div class="del"><span></span></div></div>'+
                '<p class="scC singlePicTip">建议尺寸750*<span>300</span>，类型jpg、png</p>'+
                '<p class="subtitle">链接商品</p>'+
                '<div class="relatedCom singleRelatedCom" goodsId="" style="display: inline-block;">'+
                    '<img src="/shopDecorate/images/bannerBr.jpg">'+
                    '<div></div>'+
                    '<p class="g" seleId="'+ (Number(_this.find(".moduleNum").text())+1) +'">链接商品</p>'+
                '</div>'+
            '</div>';
        $(".singleWrap").append(str);
        moveOpe();
        onePicHover();
        appObj.uploadPic($(".singleWrap #filedataSingle"+ _this.find(".moduleNum").text() ), 'newSingle'+ _this.find(".moduleNum").text(), function(data){
            $(this).parent().siblings('img').attr("src", data.result.data.imageUrl);
        })
        _this.find(".moduleNum").text( $(".singleWrap").find(".onePic").length );
    }else{
        $(".blackBg,.dialog,.winTab").show();
        $(".dialog").attr("chooseNum", $(this).find("div").find("span").eq(1).text() );
        $(".dialog").find(".title").text("选择商品");
    }
})

$("body").on("click",".g",function(){   //调出关联商品弹窗
    $(".blackBg,.dialog").show();
    $(".dialog").find(".title").text("关联商品");
    $(".dialog").find(".confirm").attr('seleId', $(this).attr('seleId'));
    if ( $(this).parents(".moduleMain").hasClass("carousel") ) {
        $(".dialog").attr("from", "banner");
    }else if ( $(this).parents(".moduleMain").hasClass("addSingle") ) {
        $(".dialog").attr("from", "single");
    }else if ( $(this).parents(".moduleMain").hasClass("addDouble") ) {
        $(".dialog").attr("from", "double");
    }
    appObj.getGoods('', '', 1);
    appObj.goodsClassify();
})

$(".addGoods").on("click",function(){   //调出选择商品弹窗
    $(".blackBg,.dialog").show();
    if( $(this).siblings(".grA").text() == '橱窗推荐' ){
        $(".blackBg,.dialog,.winTab").show();
        $(".dialog").find(".title").text("橱窗推荐");  
        var allChoose = '';
        if ( $(".winRecWrap ul").find("li").length > 0 ) {
            for( var i=0;i<$(".winRecWrap ul").find("li").length;i++ ){
                allChoose += $(".winRecWrap ul").find("li").eq(i).attr("goodsId")+',';
            }
        }
        appObj.getGoods('', '', 1);
        $(".winTab").attr('allChoose', allChoose);
        getHaveChoose($(".winRecWrap ul"));
    }else if ( $(this).siblings(".grA").text() == '商品推荐' ) {
        $(".blackBg,.dialog,.winTab").show();
        $(".dialog").find(".title").text("商品推荐");
        $(".dialog").attr("modualId", $(this).parent().attr("moudleid"));
        var allChoose = '';
        if ( $(".goodsRecWrap ul").find("li").length > 0 ) {
            for( var i=0;i<$(".goodsRecWrap ul").find("li").length;i++ ){
                allChoose += $(".goodsRecWrap ul").find("li").eq(i).attr("goodsId")+',';
            }
        }
        appObj.getGoods('', '', 1);
        $(".winTab").attr('allChoose', allChoose);
        getHaveChoose($(".goodsRecWrap ul"));
    }
    
    appObj.getGoods('', '', 1);
    appObj.goodsClassify();
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
    var limitNum = ( $(".dialog").find(".title").text() == "橱窗推荐"?3:11 );
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
                appObj.delWindowGoods($(".winHasChoose").find("li").eq(i).find(".delGoods"), $(".winHasChoose").find("li").eq(i).attr('goodsid'));
            }
        }
    }
})
function delGoods(tar){
    var regGoodsId = new RegExp($(this).parent().attr("goodsid")+",","g");
    $(".winTab").attr('allChoose', $(".winTab").attr("allChoose").replace(regGoodsId, ''));
    setGoodsChoose();
    appObj.delWindowGoods(tar, tar.parent().attr('goodsid'));
}
$(".winHasChoose").on("click",".delGoods",function(){
    var tar = $(this);
    delGoods(tar);
})
$(".goodsRecWrap,.winRecWrap").on("click",".goodsDel",function(){
    var tar = $(this);
    delGoods(tar);
})

$(".confirm").on("click",function(){
    $(".dialog,.blackBg").hide();
    if ( $(".dialog").attr("from") == 'banner' ) {
        for( var i=0;i<$(".carouselWrap").find(".onePic").length;i++ ){
            if ( $(this).attr('seleId') == $(".carouselWrap").find(".onePic").eq(i).find(".g").attr('seleId') ) {
                $(".carouselWrap").find(".onePic").eq(i).find(".relatedCom").attr("goodsId", $(this).data("sele").goodsId);
                $(".carouselWrap").find(".onePic").eq(i).find(".relatedCom img").attr("src", $(this).data("sele").imgSrc);
            }
        }
    }else if ( $(".dialog").attr("from") == 'single' && $(this).parent().siblings(".title").text() == '关联商品' ) {
        for( var i=0;i<$(".singleWrap").find(".onePic").length;i++ ){
            if ( $(this).attr('seleId') == $(".singleWrap").find(".onePic").eq(i).find(".g").attr('seleId') ) {
                $(".singleWrap").find(".onePic").eq(i).find(".relatedCom").attr("goodsId", $(this).data("sele").goodsId);
                $(".singleWrap").find(".onePic").eq(i).find(".relatedCom img").attr("src", $(this).data("sele").imgSrc);
            }
        }
    }else if ( $(".dialog").attr("from") == 'double' && $(this).parent().siblings(".title").text() == '关联商品' ) {
        for( var i=0;i<$(".doubleWrap").find(".onePic").length;i++ ){
            if ( $(this).attr('seleId') == $(".doubleWrap").find(".onePic").eq(i).find(".g").attr('seleId') ) {
                $(".doubleWrap").find(".onePic").eq(i).find(".relatedCom").attr("goodsId", $(this).data("sele").goodsId);
                $(".doubleWrap").find(".onePic").eq(i).find(".relatedCom img").attr("src", $(this).data("sele").imgSrc);
            }
        }
    }else if ( $(this).parent().siblings(".title").text() == '橱窗推荐' ) {
        var spuIds = '', from = 'dialog';
        for( var i=0;i<$(".winHasChoose ul").find("li").length;i++ ){
            spuIds += $(".winHasChoose ul").find("li").eq(i).attr("goodsId")+','
        }
        spuIds = spuIds.substring(0,spuIds.length-1);
        appObj.saveWindow(spuIds, from);
    }else if ( $(this).parent().siblings(".title").text() == '商品推荐' ) {
        var modualId = $(this).parent().parent().attr("modualId"),
            goodsId = $(this).parent().siblings(".content").find(".winTab").attr("allchoose"),
            from = "dialog",
        goodsId = goodsId.substring(0,goodsId.length-1);
        appObj.comGoodsSaveFn(modualId, goodsId, '', from);
    }
})

$(".close,.cancel").on("click",function(){
    $(".blackBg,.dialog").hide();
})

function setFixed(){
    if ( $(document).scrollTop() > 180 ) {
        $(".mainTab,.left,.right").css({
            'position': 'fixed'
        })
        $(".mid").css({
            'margin': '75px 0 0 412px'
        })
    }else{
        $(".mainTab").css({
            'position': 'relative'
        })
        $(".left").css({
            'position': 'static'
        })
        $(".right").css({
            'position': 'static'
        })
        $(".mid").css({
            'margin': '0 0 0 208px'
        })
    }
}
setFixed();
$(document).on("scroll",function(){
    setFixed();
})

function lengthReduce(str){
    if ( str == null ) {
        str = '';
    }
    return str.substring(0,str.length-1)
}

function onePicHover(){
    $(".onePic").hover(function(){
        $(this).find(".ope").show();
    },function(){
        $(this).find(".ope").hide();
    })
    $(".relatedCom").hover(function(){
        $(this).find(".g").show();
    },function(){
        $(this).find(".g").hide();
    })
}
onePicHover();

$(".list").hover(function(){
    $(this).find(".addModular").show();
},function(){
    $(this).find(".addModular").hide();
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
    $("#success_tip").html(message).css("margin-left", -$("#success_tip").width()).show();
    setTimeout(function() {
        $("#success_tip").hide().html("");
    }, 3000);
}
function dialogPosition(){
    $(".dialog").css({
      'left': ($(window).width()-$(".dialog").width())/2+'px',
      'top': ($(window).height()-$(".dialog").outerHeight())/2+'px'
    })
}
dialogPosition();
$(window).on("resize",function(){
    dialogPosition();
})

})