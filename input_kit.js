

'use strict';

var dappAddress = "n1gSjAjpXiiiGjwGErHuQdtnH4ngtbquELy";
// var dappAddress = "n1skDiY9YgdM5o6fxyjMefd2vXX1kPCSY6j";
var Inputkit = function() {

}
Inputkit.prototype = {

    init: function() {
        var self = this;
        $("#submit").click(function() {
            self.commitkit();
        });
    },
	showMessage:function (message){
		layer.open({
			content: message,
			skin: 'msg',
			time: 2
		});
	},
    commitkit: function() {
		var self = this;
        var kit_place = $("#kit_place").val();
        var kit_name = $("#kit_name").val();
        var kit_topic = $("#kit_topic").val();
        var kit_days = $("#kit_days").val();
        var kit_hotel = $("#kit_hotel").val();
        var kit_image = $("#kit_image").attr("src");
        var kit_time = getNowFormatDate();
        var kit_fee = $("#kit_fee").val();
        var kit_text =$("#kit_text").val();
        var warning_note = "";
		
       if(kit_name == "") {
		    $("#kit_name").focus();
            self.showMessage('请填写昵称');
            // 弹框
            return;
        }
		if(kit_place == "") {
			$("#kit_place").focus();
            self.showMessage('请填写目的地');
            // 弹框
            return;
        }
        if (kit_topic == "") {
			$("#kit_topic").focus();
            self.showMessage('请填写攻略题目');
            // 弹框
            return;
        }
		
        if (kit_days == "") {
			$("#kit_days").focus();
            self.showMessage('请填写出行天数');
            // 弹框
            return;
        }
		
		
		if (kit_text == "") {
           	$("#kit_text").focus();
            self.showMessage('请填写攻略正文');
            // 弹框
            return;
        }
       
        if (kit_image != "" && kit_image != "images/upimg.png") {
			var file_src=$("#myfile").attr("src");
			var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
			 var fileSize;
			 if(isIE){
				 var fileSystem = new ActiveXObject("Scripting.FileSystemObject");        
				 var file = fileSystem.GetFile (file_src);     
				 fileSize = file.Size;
			 }else{
				  fileSize = document.getElementById("myfile").files[0].size;
             }
             
             var length = kit_image.replace(/[^\u0000-\u00ff]/g,"aaa").length;
             console.log(length);
             if (length > 112400) {
                 $("#myfile").focus();
                 self.showMessage('抱歉，暂时不支持大图片，请选择小图片(base64编码大小需小于128K)"');
                 // 弹框
                 return;
             }
        }
        if (kit_image == "images/upimg.png") {
            $("#myfile").focus();
            self.showMessage('请上传图片');
            // 弹框
            return;
        }
        // 提交
        var func = "add_kit_to_list";
        var req_arg_item = {
            "name": kit_name,
            "place": kit_place,
            "topic": kit_topic,
            "days": kit_days,
            "hotel": kit_hotel,
			"time" : kit_time,
			"fee" : kit_fee,
			"kit_text" : kit_text,
            "image": kit_image,
            "time_stamp": Date.parse(new Date())
        };
        var req_args = [];
        req_args.push(req_arg_item);

        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : func,
                    "args" : JSON.stringify(req_args),
                }
            },
            "method": "neb_sendTransaction"
        }, "*");
    },

    listenWindowMessage: function() {
        var self = this;
        window.addEventListener('message', function(e) {
            // e.detail contains the transferred data
            if(e.data && e.data.data && e.data.data.neb_call) {
                // 收到返回数据
                if(e.data.data.neb_call.result) {
                    // 解析数据
                    var obj = JSON.parse(e.data.data.neb_call.result);
					self.showMessage(obj.message);
					setTimeout('window.location.reload()',2000);
                    //console.log(obj);
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    }
}
//获取当前时间
	function getNowFormatDate() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
		month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		+ " " + date.getHours() + seperator2 + date.getMinutes()
		+ seperator2 + date.getSeconds();
		return currentdate;
	}

var inputkitObj;

function checkNebpay() {
    console.log("check nebpay")
    try{
        var NebPay = require("nebpay");
    }catch(e){
        //alert ("Extension wallet is not installed, please install it first.")
        console.log("no nebpay");
        $("#noExtension").removeClass("hide")
    }

    // 环境ok，拉取数据
    inputkitObj = new Inputkit();
    inputkitObj.init();
    inputkitObj.listenWindowMessage();
}



function initPage() {
    
    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        $("#kit_input_warning").hide();
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    