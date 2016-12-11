// Initialize your app
var myApp = new Framework7({

    animatedNavBackIcon:true,
    swipePanel:'left',
    cache:true
});

var $$ = Dom7;
var base_url="http://www.einsteinquotations.com/api/dom.php";
var mainView = myApp.addView('.view-main', {
   
    dynamicNavbar: true,
    domCache:true
});

var geocoder;

var map;


var findation_url="http://findation.com";
var Brand_ids=[];
var Brand_names=[];

var Product_ids=[];
var Product_names=[];

var selectedBrands,selectedProducts;
var autocompleteDropdownExpand = myApp.autocomplete({
    input: '#brand-dropdown',
    openIn: 'dropdown',
    preloader:true,
    expandInput: true, // expand input
    valueProperty: 'id', //object's "value" property name
    textProperty: 'text', //object's "text" property name

    source: function (autocomplete, query, render) {
        var results = [];

        // Show Preloader
        autocomplete.showPreloader();

        //alert(JSON.stringify(selectedBrands));
        $$.ajax({
            url: base_url+'?mode=listbrands',
            method: 'GET',
            dataType: 'json',
            success: function(data) {

                for (var i = 0; i < data.length; i++) {
                    if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
                    {
                        results.push(data[i].name);

                    }
                    Brand_ids[i]=data[i].id;
                    Brand_names[i]=data[i].name;
                }
                // Hide Preoloader
                autocomplete.hidePreloader();
                // Render items by passing array with result items
                render(results);
            }
        });
    },
    onClose: function (autocomplete, value) {
        $$('#product-dropdown').val('');
        $$('#shade-dropdown').val('');
    }
});
var store_info=[];

var results=[];
var hebStoreDropdown = myApp.autocomplete({
    input: '#hebstore-dropdown',
    openIn: 'dropdown',
    preloader:true,
    expandInput: true, // expand input
    valueProperty: 'id', //object's "value" property name
    textProperty: 'text', //object's "text" property name

    source: function (autocomplete, query, render) {


        // Show Preloader
        autocomplete.showPreloader();

        //alert(JSON.stringify(selectedBrands));
        $$.ajax({
            url: base_url+'?mode=displaystores',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
               results=[];
                store_info=[];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].address.toLowerCase().indexOf(query.toLowerCase()) >= 0)
                    {
                        results.push('HEB '+data[i].id+', '+data[i].address+' '+data[i].state+' '+data[i].zipcode);

                        store_info[i]=data[i];
                    }

                }
                // Hide Preoloader
                autocomplete.hidePreloader();
                // Render items by passing array with result items
                render(results);
            }
        });
    },
    onClose: function (autocomplete, value) {
        $("#assoc-dropdown").empty();
        var index=results.indexOf($$("#hebstore-dropdown").val());
        if(index) {
            $$("#assoc-dropdown").append('<option>' + store_info[index].beauty_assoc_1 + '</option>');

            $$("#assoc-dropdown").append('<option>' + store_info[index].beauty_assoc_2 + '</option>');

            $$("#assoc-dropdown").append('<option>' + store_info[index].beauty_assoc_3 + '</option>');

            $$("#assoc-dropdown").append('<option>' + store_info[index].beauty_assoc_4 + '</option>');

            $$("#assoc-dropdown").append('<option>' + store_info[index].beauty_assoc_5 + '</option>');
        }
    }
});

var productDropDown = myApp.autocomplete({
    input: '#product-dropdown',
    openIn: 'dropdown',
    preloader: true, //enable preloader
    valueProperty: 'id', //object's "value" property name
    textProperty: 'name', //object's "text" property name
    limit: 20, //limit to 20 results
    dropdownPlaceholderText: 'Search products',
    expandInput: true, // expand input
    source: function (autocomplete, query, render) {
        var results = [];

        // Show Preloader
        autocomplete.showPreloader();
        if(!window.localStorage["selectedBrands"])
        selectedBrands=Brand_ids[Brand_names.indexOf($$("#brand-dropdown").val())];
    	//alert(JSON.stringify(selectedBrands));
    	$$.ajax({
            url: base_url+'?mode=listproducts&&brand_id='+selectedBrands,
            method: 'GET',
            dataType: 'json',
            success: function(data) { 
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) 
                    {
                    	results.push(data[i].name);

                    }
                    Product_ids[i]=data[i].id;
                    Product_names[i]=data[i].name;
                }
                // Hide Preoloader
                autocomplete.hidePreloader();
                // Render items by passing array with result items
                render(results);
            }
        });
	},
    onClose: function (autocomplete, value) {
        $$('#shade-dropdown').val('');
    }
});

var shadeDropDown = myApp.autocomplete({
    input: '#shade-dropdown',
    openIn: 'dropdown',
    preloader: true, //enable preloader
    valueProperty: 'id', //object's "value" property name
    textProperty: 'name', //object's "text" property name
    limit: 20, //limit to 20 results
    dropdownPlaceholderText: 'Search shades',
    expandInput: true, // expand input
    source: function (autocomplete, query, render) {
        var results = [];

        // Show Preloader
        autocomplete.showPreloader();
        if(!window.localStorage["selectedProducts"])
            selectedProducts=Product_ids[Product_names.indexOf($$("#product-dropdown").val())];
    	//alert(JSON.stringify(selectedProducts));
    	//alert(JSON.stringify(selectedProducts));
    	$$.ajax({
            url: base_url+'?mode=listshades&&product_id='+selectedProducts,
            method: 'GET',
            dataType: 'json',
            success: function(data) { 
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i].name);
                }
                // Hide Preoloader
                autocomplete.hidePreloader();
                // Render items by passing array with result items
                render(results);
            }
        });
	}
});
$$("#btn-search").on('click',function(e)
{

    var brandName=$$('#brand-dropdown').val();
    var productName=$$('#product-dropdown').val();
    var shadeName=$$('#shade-dropdown').val();
    if(brandName&&productName&&shadeName) {
        var pageName = "searchresult?brand_name=" + brandName + "&&product_name=" + productName + "&&shade_name=" + shadeName;
        window.localStorage["saved_brand"] = $$('#brand-dropdown').val();
        window.localStorage["saved_product"] = $$('#product-dropdown').val();
        window.localStorage["saved_shade"] = $$('#shade-dropdown').val();

        window.localStorage["saved_brand_id"] = selectedBrands;
        window.localStorage["saved_product_id"] = selectedProducts;

        mainView.router.load({pageName: pageName});
    }
});

$$("#btn-prev-search").on('click',function(e)
{
    $$('#brand-dropdown').val( window.localStorage["saved_brand"]);
    $$('#product-dropdown').val(window.localStorage["saved_product"]);
    $$('#shade-dropdown').val(window.localStorage["saved_shade"]);
    selectedBrands=window.localStorage["saved_brand_id"];
    selectedProducts=window.localStorage["saved_product_id"];
});

myApp.onPageInit('search', function (page) {
    $$("#brand-dropdown").val('');
    $$("#product-dropdown").val('');
    $$("#shade-dropdown").val('');
});

myApp.onPageReinit('search', function (page) {
    $$("#brand-dropdown").val('');
    $$("#product-dropdown").val('');
    $$("#shade-dropdown").val('');
});

$$("#btn-signin").on('click',function(e){

    var email=$$('#loginmail').val();
    var password=$$('#loginpassword').val();
    //var email=$$('#email').val();
    if(loginvalidation()) {
        myApp.showIndicator();
        $$.ajax({
            url: base_url + '?mode=login',
            method: 'POST',
            dataType: 'text',
            data: {email: email, password: password},
            success: function (data) {

                var result = JSON.parse(data);
                if (result.result == "success") {
                    mainView.router.load({pageName: "main"});
                }
                else
                    myApp.alert("Please check your email and password", "Login failed");

            },
            statusCode: {
                404: function (xhr) {
                    myApp.alert("Server Error", "Login failed");
                },
                500: function(xhr){
                    myApp.alert("Server Error", "Login failed");
                }
            },
            complete: function(xhr,status)
            {
                myApp.hideIndicator();
            }

        });
    }
});

function loginvalidation()
{
    var email=$$('#loginmail').val();
    var password=$$('#loginpassword').val();
    if(!email||!password)
    {
        myApp.alert("Please fill all the required fields!","Registration");
        return false;
    }

    return true;
}

myApp.onPageInit('register', function (page) {
    $$.ajax({
        url:'js/countries.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            var str='';
            for (var i = 0; i < data.countries.country.length; i++) {
                str+='<option value="'+data.countries.country[i].countryCode+'">'+data.countries.country[i].countryName+'</option>';
            }
            $$("#countries").html(str);
        }
    });
    $$("#btn-register").on('click',function(e){

        var formData=myApp.formGetData('register-form');
        var formurl=JSON.stringify(formData);
        var email=$$('#email').val();
        if(validation()) {
            myApp.showIndicator();
            $$.ajax({
                url: base_url + '?mode=register',
                method: 'POST',
                dataType: 'text',
                data: {formdata: formurl, email: email},
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result.result == "success")
                        myApp.alert("Registration is completed", "Registration");
                    else
                        myApp.alert("Registration failed!", "Registration");
                    myApp.hideIndicator();
                }
            });
        }
    });
});
function validation()
{
    var firstName=$$('#first-name').val();
    var lastName=$$('#last-name').val();
    var email=$$('#email').val();
    var phone=$$('#phone-number').val();
    var password=$$('#password').val();
    var confirm=$$('#confirm').val();
    var address1=$$("#address1").val();
    if(!firstName||!lastName||!email||!password||!confirm||!address1||!phone)
    {
        myApp.alert("Please fill all the required fields!","Registration");
        return false;
    }
    if(password!=confirm) {
        myApp.alert("Passwords do not match", "Registration");
        return false;
    }
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if(!re.test(email))
    {
        myApp.alert("Email is not valid!", "Registration");
        return false;
    }
    return true;
}

myApp.onPageInit('searchresult', function (page) {

    var brand_name = page.query.brand_name;
    var product_name = page.query.product_name;
    var shade_name = page.query.shade_name;
    find_products(brand_name,product_name,shade_name);

    $$(".checkbox").change(function(){
        $$("#checkbox-all").prop('checked',false);
        filter_products();
    });
    $$("#checkbox-all").change(function(){
        $$(".checkbox").prop('checked',true);
        filter_products();
    });


});

myApp.onPageInit('topresult', function (page) {
    var shade_name, product_name, brand_name;
    shade_name = page.query.shade_name;
    product_name = page.query.product_name;
    brand_name = page.query.brand_name;
    if(page.query.mode=="shade") {

        find_products(null,null, shade_name);
    }
    else if(page.query.mode=="product") {

        find_products(null,product_name,null);
    }
    else if(page.query.mode=="brand") {

        find_products(brand_name,null,null);
    }
    else
        find_favorites(brand_name,product_name,shade_name);
});


myApp.onPageReinit('topresult', function (page) {
    var shade_name, product_name, brand_name;
    shade_name = page.query.shade_name;
    product_name = page.query.product_name;
    brand_name = page.query.brand_name;
    if(page.query.mode=="shade") {

        find_products(null,null, shade_name);
    }
    else if(page.query.mode=="product") {

        find_products(null,product_name,null);
    }
    else if(page.query.mode=="brand") {

        find_products(brand_name,null,null);
    }
    else
        find_favorites(brand_name,product_name,shade_name);


});

function filter_products()
{
    if($$("#checkbox-all").is(':checked'))
    {
        $$(".search-list ul li").css('display','block');
    }
    else {
        $$(".search-list ul li").css('display', 'none');
        if ($$("#checkbox-covergirl").is(':checked'))
            $$(".search-list ul li[data-brand='CoverGirl']").css('display', 'block');
        if ($$("#checkbox-revlon").is(':checked'))
            $$(".search-list ul li[data-brand='Revlon']").css('display', 'block');
        if ($$("#checkbox-maybelline").is(':checked'))
            $$(".search-list ul li[data-brand='Maybelline']").css('display', 'block');
        if ($$("#checkbox-nyx").is(':checked'))
            $$(".search-list ul li[data-brand='NYX']").css('display', 'block');
        if ($$("#checkbox-heb").is(':checked'))
            $$(".search-list ul li[data-brand='Heb']").css('display', 'block');
    }
}

myApp.onPageReinit('searchresult', function (page) {

    var brand_name = page.query.brand_name;
    var product_name = page.query.product_name;
    var shade_name = page.query.shade_name;
    find_products(brand_name,product_name,shade_name);

    $$(".checkbox").change(function(){
        $$("#checkbox-all").prop('checked',false);
        filter_products();
    });
    $$("#checkbox-all").change(function(){
        $$(".checkbox").prop('checked',true);
        filter_products();
    });
});

myApp.onPageInit('product', function (page) {
    myApp.showIndicator();

    load_product_info(page.query.url);
    initMap();
    var url= base_url+'?mode=displaystore&&store_id='+page.query.productid%281;
    $$.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {

            codeAddress(data[0].address);
            $(".store-content").prepend(data[0].address+' '+data[0].state+' '+data[0].zipcode);
        }
    });


    $(window).trigger('resize');
});

myApp.onPageReinit('product', function (page) {

    myApp.showIndicator();
    load_product_info(page.query.url);

    initMap();
    var url= base_url+'?mode=displaystore&&store_id='+page.query.productid%281;

    $$.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {

            codeAddress(data[0].address);
            $(".store-content").prepend(data[0].address+' '+data[0].state+' '+data[0].zipcode);
        }
    });
    $(window).trigger('resize');

});

function initMap() {
    //  var x=parseFloat(lat);
    // var y=parseFloat(long);
    geocoder = new google.maps.Geocoder();

    var location = { lat:37.23, lng:-120.4 };
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 8,
        center: location
    });

    addMarker(location, map);
}
function addMarker(location, map) {

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function codeAddress(address) {

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

$$('.btn-schedule').click(function(e){
    myApp.alert("Thank you for scheduling a consultation! We will send you an email with information about your appointment","Schedule",function(){
    });
});
function load_product_info(url)
{
    $$.ajax({
        url: base_url+'?mode=showproduct&&product_url='+url,
        method: 'GET',
        dataType: 'text',
        success: function(data) {
            $$(".temp").html(data);
            $$(".temp").find('script').remove()
            var result=$(".temp").contents().find($(".row")[0]).html().trim();
            $(".product-content").html(result);
            $(".product-content").contents().find('.box').remove();
            //$(".product-content").contents().find('p').remove();
            $(".product-content").contents().find('iframe').remove();
            $(".product-content").contents().find('ul').remove();
            $(".product-content").contents().find('a').remove();
            myApp.initImagesLazyLoad('.product-content');
            myApp.hideIndicator();
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function find_products(brand_name,product_name,shade_name)
{
    myApp.showIndicator();
    var productArray=[];
    $$.ajax({
        url: base_url+'?mode=searchproducts&&brand_name='+brand_name+'&&product_name='+product_name+'&&shade_name='+shade_name,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $$(".search-list ul").html('');
            if (data.length > 0)
            {
                data.sort(function(a,b){
                        var obj1= JSON.parse(a.content);
                    var title1= a.title;

                    var obj2= JSON.parse(b.content);
                    var title2= b.title;
                    if(title1<title2)
                        return -1;
                    else
                        return 1;
                });

                for (var i = 0; i < data.length; i++) {
                    //productArray.push(htmlObj);
                    var product_info = JSON.parse(data[i].content);
                    var image_url=filter_slash(product_info.image);
                    if(image_url.substr(0,4)!='http')
                        image_url=findation_url+image_url;
                    var htmlObj = '<li data-brand="'+filter_slash(product_info.title)+'">' +
                        '<a href="#product?productid='+data[i].id+'&&url=' + filter_slash(product_info.url) + '" class="item-link">' +
                            '<div class="item-content">'+
                        '<div class="item-media"><img class="lazy lazy-fadeIn" src="' + image_url + '"/></div>' +
                        '<div class="item-inner"><div class="item-title"><div class="item-title-row">' + data[i].title + '</div>' +
                        '<div class="item-text">' + filter_slash(product_info.content) + '</div></div>' +
                        '</div></div>' +
                        '</a>' +
                        '</li>';

                    $$(".search-list ul").append(htmlObj);

                }
                $$('img.lazy').trigger('lazy');
                myApp.hideIndicator();
            }
            else
            {
               // $$(".search-list ul").empty();
                var htmlObj = '<li>' +
                    '<div class="item-content">No results found</div>'+

                    '</li>';
                $$(".search-list ul").append(htmlObj);
            }
            myApp.hideIndicator();
        },
        failed:function(data)
        {
            myApp.hideIndicator();
        }
    });
}

function find_favorites(brand_name,product_name,shade_name)
{
    myApp.showIndicator();
    $$.ajax({
        url: base_url+'?mode=searchfavorites&&brand_name='+brand_name+'&&product_name='+product_name+'&&shade_name='+shade_name,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $$(".search-list ul").html('');
            if (data.length > 0)
            {
                for (var i = 0; i < data.length; i++) {
                    var product_info = JSON.parse(data[i].content);
                    var image_url=filter_slash(product_info.image);
                    if(image_url.substr(0,4)!='http')
                        image_url=findation_url+image_url;
                    var htmlObj = '<li data-brand="'+filter_slash(product_info.title)+'">' +
                        '<a href="#product?productid='+data[i].id+'&&url=' + filter_slash(product_info.url) + '" class="item-link">' +
                        '<div class="item-content">'+
                        '<div class="item-media"><img src="' + image_url + '"/></div>' +
                        '<div class="item-inner"><div class="item-title"><div class="item-title-row">' + filter_slash(product_info.title) + '</div>' +
                        '<div class="item-text">' + filter_slash(product_info.content) + '</div></div>' +
                        '</div></div>' +
                        '</a>' +
                        '</li>';

                    $$(".search-list ul").append(htmlObj);
                }
                myApp.hideIndicator();
            }
            else
            {
                // $$(".search-list ul").empty();
                var htmlObj = '<li>' +
                    '<div class="item-content">No results found</div>'+

                    '</li>';
                $$(".search-list ul").append(htmlObj);
            }
            myApp.hideIndicator();
        },
        failed:function(data)
        {
            myApp.hideIndicator();
        }
    });
}

function filter_slash(text)
{
    return text.replace('\\','');
}