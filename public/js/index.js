//-------------------侧边按钮点击图层显示
//getDisaOfTime();
var Url = "http://59.173.238.34:3030/api/getDisaOfTime"; //-----------服务器后台数据请求地址
ajax(); //-----------调用ajax
var xfr2 = document.getElementsByClassName("xfr2");
var liebiao = document.getElementsByClassName("liebiao");
liebiao[0].style.display = "none";

$(".xfr3").css("display","none");
$(".xfr2").click(function() {
	if(liebiao[0].style.display == "none") {
		$(".liebiao").slideDown("slow");
	} else {
		$(".liebiao").slideUp("slow");
	}
	$(".xfr3").css("display","block");
})
$(".xfr3").click(function(){
	$(".liebiao").fadeOut();
	$(".xfr3").css("display","none");
})
// ----------底部点击效果，图层显示
var tongyong = document.getElementsByClassName("tongyong");
var ty = document.getElementsByClassName("ty");
$(".tongyong").each(function() {
	$(this).fadeOut();
})
for(let i = 0; i < ty.length; i++) {
	(function(i) {
		ty[i].onclick = function() {
			$(".tongyong").fadeOut();
			if(tongyong[i].style.display == "none") {
				$(tongyong[i]).fadeIn("slow");
			} else {
				$(tongyong[i]).fadeOut("slow");
			}

		}
	})(i);
}

//-------------------------谷歌地图接入			

var normalMap = L.tileLayer.chinaProvider('Google.Normal.Map', {
		maxZoom: 18,
		minZoom: 3
	}),
	satelliteMap = L.tileLayer.chinaProvider('Google.Satellite.Map', {
		maxZoom: 18,
		minZoom: 3
	});

var baseLayers = {
	"地图": normalMap,
	"影像": satelliteMap,
}

var overlayLayers = {

}

var map = L.map("map", {
	center: [39.9788, 116.30226],
	zoom: 4,
	layers: [normalMap],
	zoomControl: false
});

L.control.layers(baseLayers, overlayLayers).addTo(map);
L.control.zoom({
	zoomInTitle: '放大',
	zoomOutTitle: '缩小'
}).addTo(map);

//L.marker([39.9788, 116.30226]).addTo(map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.');
//L.marker([32.56, 103.345]).addTo(map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.');

//--------------图标点击回到最初位置
$(".xfr5").click(function() {
	
	map.setView([39.9788, 116.30226], 12);
})

var position1 = [ //绿色圆位置
	[37.93553, 78.84888],
	[36.89719, 78.22266]
];

var circleStyle1 = {
	radius: 10000,
	"fillColor": "green",
	"opacity": 1,
	"color": "blue",
	fillOpacity: 1,
	weight: 0
};
var circleLayers1 = [];
//添加绿色圆
for(var i = 0; i < 2; i++) {
	(function(i) {
		var circleLayer = L.circle(position1[i], circleStyle1);
		circleLayers1.push(circleLayer);
		circleLayer.on('click', function(e) {
			var popup = L.popup()
				.setLatLng(e.latlng)
				.setContent('<p>人口统计' + (i + 1) + e.latlng + '</p>')
				.openOn(map);
		});
	})(i)
}
//创建图层组
var totalLayer = L.layerGroup(circleLayers1).addTo(map); //绿色圆

//n2.viewer = null;
//n2.webGisLocalhost ="59.173.238.34:3030";
//n2.geoServer = '59.173.238.34:12317';

//--------------------后台数据请求
function ajax() {
	$.ajax({
		url: Url,
		type: 'POST',
		data: {"kind_code": "01"},
		success:function(res){
				var res = res[1]["data"];
				$(".leaflet-popup-content-wrapper").empty();
				var dzarr = [];
				var html = [];
				// 使用用户自己的图标
		        var minIcon = L.icon({
		            iconUrl: 'Oval8x8.png',
//		            shadowUrl: 'leaf-shadow.png',
//		            iconSize:     [38, 95], // size of the icon
//		            shadowSize:   [50, 64], // size of the shadow
		            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		            shadowAnchor: [4, 62],  // the same for the shadow
		            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
		        });
		        var LeafIcon = L.Icon.extend({
			        options: {
//			            shadowUrl: 'leaf-shadow.png',
//			            iconSize:     [38, 95],
//			            shadowSize:   [50, 64],
//			            iconAnchor:   [22, 94],
//			            shadowAnchor: [4, 62],
//			            popupAnchor:  [-3, -76]
			        }
		        });
		        var minIcon = new LeafIcon({iconUrl: 'Oval8x8.png'});
		        midIcon = new LeafIcon({iconUrl: 'Oval10x10png.png'});
		        midsIcon = new LeafIcon({iconUrl: 'Oval12x12.png'});
		        maxIcon = new LeafIcon({iconUrl: 'Oval14x14.png'});
		        
		        L.icon = function (options) {
		        return new L.Icon(options);
		        };
		        var span1 = 0;
		        var span2 = 0;
		        var span3 = 0;
		        var span4 = 0;
		        var trhtml = "";
				for(var i = 0;i<res.length;i++) {
					if(res[i]["disaster_text"].mag >= 4 && res[i]["disaster_text"].mag < 5){
						var strHTML = "<span style='font-weight:bolder;font-size:14px'>" + res[i].disaster_name + "</span><br>" +
								"发震时刻：" + res[i].disaster_happendate.substr(0,res[i].disaster_happendate.length-5).replace(/T/g,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;") + "<br>" +
					 			"纬度：" + res[i]["disaster_text"].lat + "<br>" +
								"经度：" + res[i]["disaster_text"].lon + "<br>" +
								"深度：" + res[i]["disaster_text"].deep + "<br>" +
								"震级：" + res[i]["disaster_text"].mag + "<br>" +
								"震中海拔：" + res[i]["disaster_text"].elevation;
						L.marker([res[i]["disaster_text"].lat,res[i]["disaster_text"].lon],{icon: minIcon}).addTo(map).bindPopup(strHTML);
						span1++;
					}else if(res[i]["disaster_text"].mag >= 5 && res[i]["disaster_text"].mag < 6){
						var strHTML = "<span style='font-weight:bolder;font-size:14px'>" + res[i].disaster_name + "</span><br>" +
								"发震时刻：" + res[i].disaster_happendate.substr(0,res[i].disaster_happendate.length-5).replace(/T/g,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;") + "<br>" +
					 			"纬度：" + res[i]["disaster_text"].lat + "<br>" +
								"经度：" + res[i]["disaster_text"].lon + "<br>" +
								"深度：" + res[i]["disaster_text"].deep + "<br>" +
								"震级：" + res[i]["disaster_text"].mag + "<br>" +
								"震中海拔：" + res[i]["disaster_text"].elevation;
						L.marker([res[i]["disaster_text"].lat,res[i]["disaster_text"].lon],{icon: midIcon}).addTo(map).bindPopup(strHTML);
						span2++;
					}else if(res[i]["disaster_text"].mag >= 6 && res[i]["disaster_text"].mag < 7){
						var strHTML = "<span style='font-weight:bolder;font-size:14px'>" + res[i].disaster_name + "</span><br>" +
								"发震时刻：" + res[i].disaster_happendate.substr(0,res[i].disaster_happendate.length-5).replace(/T/g,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;") + "<br>" +
					 			"纬度：" + res[i]["disaster_text"].lat + "<br>" +
								"经度：" + res[i]["disaster_text"].lon + "<br>" +
								"深度：" + res[i]["disaster_text"].deep + "<br>" +
								"震级：" + res[i]["disaster_text"].mag + "<br>" +
								"震中海拔：" + res[i]["disaster_text"].elevation;
						L.marker([res[i]["disaster_text"].lat,res[i]["disaster_text"].lon],{icon: midsIcon}).addTo(map).bindPopup(strHTML);
						span3++;
					}else if(res[i]["disaster_text"].mag > 7){
						var strHTML = "<span style='font-weight:bolder;font-size:14px'>" + res[i].disaster_name + "</span><br>" +
								"发震时刻：" + res[i].disaster_happendate.substr(0,res[i].disaster_happendate.length-5).replace(/T/g,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;") + "<br>" +
					 			"纬度：" + res[i]["disaster_text"].lat + "<br>" +
								"经度：" + res[i]["disaster_text"].lon + "<br>" +
								"深度：" + res[i]["disaster_text"].deep + "<br>" +
								"震级：" + res[i]["disaster_text"].mag + "<br>" +
								"震中海拔：" + res[i]["disaster_text"].elevation;
						L.marker([res[i]["disaster_text"].lat,res[i]["disaster_text"].lon],{icon: maxIcon}).addTo(map).bindPopup(strHTML);
						span4++;
					}
					 var happenTime=res[i].disaster_happendate;
					 if(res[i]["disaster_text"].prov == undefined){
					 	res[i]["disaster_text"].prov = "";
					 }
					 if(res[i]["disaster_text"].city == undefined){
					 	res[i]["disaster_text"].city = "";
					 }
					 if(res[i]["disaster_text"].mag >= 4){
					 	trhtml += '<tr align=center>' +
							  '<td style="width: 91px;">' + res[i]["disaster_text"].mag + '</td>' +
							  '<td style="width: 273px;">' + happenTime.substr(0,happenTime.length-5).replace(/T/g,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;") + '</td>' +
							  '<td style="width: 91px;">' + res[i]["disaster_text"].lat + '</td>' +
							  '<td style="width: 91px;">' + res[i]["disaster_text"].lon + '</td>' +
							  '<td style="width: 91px;">' + res[i]["disaster_text"].deep + '</td>' +
							  '<td style="width: 273px;">' + res[i]["disaster_text"].prov + res[i]["disaster_text"].country + res[i]["disaster_text"].city + '</td>' +
							  '</tr>';	
					 } 	
				}
				$('.item-span1').html(span1);
				$('.item-span2').html(span2);
				$('.item-span3').html(span3);
				$('.item-span4').html(span4);
				$('.dizhenliebiao').html(trhtml);
						
		}
	});
}





 		// 使用用户自己的图标
//      var greenIcon = L.icon({
//          iconUrl: 'leaf-green.png',
//          shadowUrl: 'leaf-shadow.png',
//          iconSize:     [38, 95], // size of the icon
//          shadowSize:   [50, 64], // size of the shadow
//          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//          shadowAnchor: [4, 62],  // the same for the shadow
//          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
//      });
//      L.marker([40, 112], {icon: greenIcon}).addTo(map);
        
//      var LeafIcon = L.Icon.extend({
//      options: {
//          shadowUrl: 'leaf-shadow.png',
//          iconSize:     [38, 95],
//          shadowSize:   [50, 64],
//          iconAnchor:   [22, 94],
//          shadowAnchor: [4, 62],
//          popupAnchor:  [-3, -76]
//      }
//      });
//      var greenIcon = new LeafIcon({iconUrl: 'leaf-green.png'}),
//      redIcon = new LeafIcon({iconUrl: 'leaf-red.png'}),
//      orangeIcon = new LeafIcon({iconUrl: 'leaf-orange.png'});
//      
//      L.icon = function (options) {
//      return new L.Icon(options);
//      };
//      
//      L.marker([41.5, 99.09], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");
//      L.marker([41.495, 100.083], {icon: redIcon}).addTo(map).bindPopup("I am a red leaf.");
//      L.marker([41.49, 101.1], {icon: orangeIcon}).addTo(map).bindPopup("I am an orange leaf.");