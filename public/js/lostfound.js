var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var myneb = new Neb();

myneb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));
// myneb.setRequest(new HttpRequest("https://testnet.nebulas.io"));

var account, tx, txhash;
var serialNumber;
var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
var nebPay = new NebPay();

// account = Account.NewAccount().getAddressString();





var callbackUrl = NebPay.config.mainnetUrl;   //如果合约在主网,则使用这个

// MainNet
var dappAddress = "n1xn2u5faqvVcQwz32gHMRMXUp62TzqkXy3";
// var dappAddress = "n1k3aFJWMgX3bs66HuPSvFcKcj6dm9tztaa";

// TestNet
// var dappAddress = "n1zw55jeKbrKHSZJToH6wC1kPkbUDXxSoes";



    document.addEventListener("DOMContentLoaded", function() {
        // $("#search_value").attr("disabled",true)
        // $("#search").attr("disabled",true)

        console.log("web page loaded...")
        setTimeout(checkNebpay,100);
        setTimeout(getACC,100);

    });

    // listen message from contentscript
    window.addEventListener('message', function(e) {
        // e.detail contains the transferred data
        console.log("recived by page:" + e + ", e.data:"+ JSON.stringify(e.data));
        var resultString = JSON.stringify(e.data);

        if (resultString.search("account") !== -1){
            //document.getElementById("accountAddress").innerHTML= "Account address: " + e.data.data.account;

            // account=JSON.stringify(e.data.data.account);
            account=e.data.data.account;

            $("#hashcode").val(generateKey(account));
            $("#_id").val(account);

            //set default address hash
            $("#address").val(getHash(account));

        }
      });

    function getACC() {
        console.log("check acount")
        console.log("********* get account *****************")
           window.postMessage({
               "target": "contentscript",
               "data":{
               },
               "method": "getAccount",
           }, "*");
    }


    function checkNebpay() {
        console.log("check nebpay")
        try{
            var NebPay = require("nebpay");

            $("#search_value").attr("disabled",false)
            $("#search").attr("disabled",false)

        }catch(e){
            //alert ("Extension wallet is not installed, please install it first.")
            $("#noExtension").removeClass("hide")
        }
    }



function getHash(account) {

  // var account="n1PfySvoUyNfWg6xKDohK96TCWbSxQXLdwB";

  // const hash = crypto.createHash('sha256');
  //
  // hash.update(account);
  //
  // console.log(hash.digest('hex'));
  //
  // return hash.digest('hex');

  return CryptoJS.SHA1(account).toString();

}

function generateKey(p){
    var salt = CryptoJS.lib.WordArray.random(128/8);
    var key = CryptoJS.PBKDF2(p, salt, { keySize: 512/32, iterations: 1000 });
    var subkey = key.toString().substring(1,16);
    return subkey;
}




var arrs = [];

function init() {
        i = 0;

        arrs = dedup(arrs);

        for(var i=0;i<arrs.length;i++){

          $.create(arrs[i]);

        }
          $('.main').css('height', $('.container').height() - $('.top').height() + 'px');

}

function dedup(arr) {
	var hashTable = {};

	return arr.filter(function (el) {
		var key = JSON.stringify(el);
		var match = Boolean(hashTable[key]);

		return (match ? false : hashTable[key] = true);
	});
}

myneb.api.call({
    from: dappAddress,
    to: dappAddress,
    value: 0,
    contract: {
        function: "getAll",
        args: null
    },
    gasPrice: 1000000,
    gasLimit: 2000000,
}).then(function(tx) {

  console.log(tx.result);

  arrs = JSON.parse(tx.result);

    console.log(arrs);
    console.log("len:"+arrs.length);

    init();
});





    // 搜索功能
$("#search").click(function(){


    var from = Account.NewAccount().getAddressString();
       var value = "0";
       var nonce = "0"
       var gas_price = "1000000"
       var gas_limit = "2000000"
       var callFunction = "get";
       var callArgs = "[\"" + $("#search_value").val() + "\"]"; //in the form of ["args"]
       var contract = {
           "function": callFunction,
           "args": callArgs
       }
       myneb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
           cbSearch(resp)
       }).catch(function (err) {
           //cbSearch(err)
           console.log("error:" + err.message)
       })

})

function find(hashcode) {

     var from = Account.NewAccount().getAddressString();
     var value = "0";
     var nonce = "0"
     var gas_price = "1000000"
     var gas_limit = "2000000"
     var callFunction = "get";
     var callArgs = "[\"" + hashcode + "\"]"; //in the form of ["args"]
     var contract = {
         "function": callFunction,
         "args": callArgs
     }
     myneb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
         cbSearch(resp)
     }).catch(function (err) {
         //cbSearch(err)
         console.log("error:" + err.message)
     })
}

//return of search,
 function cbSearch(resp) {
     var result = resp.result    ////resp is an object, resp.result is a JSON string
     console.log("return of rpc call: " + JSON.stringify(result))
     var resultString = JSON.stringify(result);

     if (resultString.search('"null"') !== -1){
         $(".add_banner").addClass("hide");
         $(".result_success").addClass("hide");
         $(".result_faile").removeClass("hide");
         $("#new").removeClass("hide");
         $("#_id").val(account);
     }else{
        try{
             result = JSON.parse(result);
           }catch (err){
              console.log("parsing error " + err);
           }

         if (resultString.search("hashcode") !== -1){

             $(".add_banner").addClass("hide");
             $(".result_faile").addClass("hide");
             $("#_id").val(result.account);
             $("#hashcode").val(result.hashcode);
             $("#name").val(result.name);
             $("#address").val(result.addr);
             $("#description").val(result.description);
             $("#founder").val(result.founder);
             $("#msg").val(result.msg);
         } else {
             $(".add_banner").addClass("hide");
             $(".result_faile").addClass("hide");
             $("#search_banner").text($("#search_value").val())
             $("#search_result").text(result)
             $(".result_success").removeClass("hide");
         }

     }
 }

// 添加信息功能
$("#add").click(function() {
    $(".result_faile").addClass("hide");
    $(".add_banner").removeClass("hide");

    $("#add_value").val("")
})


$("#save").click(function() {
        var to = dappAddress;
        var value = "0";
        var callFunction = "save"
        //var callArgs = "[\"" + $("#search_value").val() + "\",\"" + $("#add_value").val() + "\"]"
        // var arg1 = $("#search_value").val(),
        //     arg2 = $("#add_value").val();
        // var callArgs = JSON.stringify([arg1, arg2]);


        console.log("********* call smart contract \"sendTransaction\" *****************")
        var account = $("#_id").val();
        var hashcode = $("#hashcode").val();
        var address = $("#address").val();
        var name = $("#name").val();
        var description = $("#description").val();
        var founder = $("#founder").val();
        var msg = $("#msg").val();

        var callArgs = JSON.stringify([account,hashcode,address,name,description,founder,msg]);

        // var args = "[\""+account+"\""+","+"\""+hashcode+"\""+","+ "\"" + address + "\""+","+"\""+name+"\""+","+"\""+description+"\""+","+"\""+founder+"\""+","+"\""+msg+"\""+"]";
        // var args = str;

        // console.log("str "+str);
        console.log("args "+callArgs);


        serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: cbPush,       //设置listener, 处理交易返回信息
            callback: callbackUrl
        });

        console.log("serialNumber "+serialNumber);

        intervalQuery = setInterval(function () {
            funcIntervalQuery();
        }, 10000);
    });
    var intervalQuery
    function funcIntervalQuery() {
        var options = {
            callback: callbackUrl
        }
        nebPay.queryPayInfo(serialNumber,options)   //search transaction result from server (result upload to server by app)
            .then(function (resp) {
                console.log("tx result: " + resp)   //resp is a JSON string
                var respObject = JSON.parse(resp)
                if(respObject.code === 0){
                    clearInterval(intervalQuery);
                    // alert(`set ${$("#search_value").val()} succeed!`);
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    function cbPush(resp) {
        console.log("response of push: " + JSON.stringify(resp))
        var respString = JSON.stringify(resp);
        if(respString.search("rejected by user") !== -1){
            clearInterval(intervalQuery)
            alert(respString)
        }else if(respString.search("txhash") !== -1){
            //alert("wait for tx result: " + resp.txhash)
        }
    }


// listen message from contentscript
// window.addEventListener('message', function(e) {
//     // e.detail contains the transferred data
//     console.log("recived by page:" + e + ", e.data:"+ JSON.stringify(e.data));
//     if (!!e.data.data.account){
//
//
//
//     }
//
// });

$.extend({
    create: function(data) {
        var e = $("<div class=\"row\"><div>" + data.hashcode + "</div><div class=right>——" + data.name + "</div></div>");

        // $(theTable).find('tbody').append( "<tr><td id='code'>"+data.hashcode+"</td><td>"+data.name+"</td><td>"+data.description+"</td><td><button id=vote onclick=\"update('"+data.hashcode+"')\">update</button></td></tr>" );
        $(theTable).find('tbody').append( "<tr><td id='code'>"+"<a href='#' onclick=\"find('"+data.hashcode+"')\">"+data.hashcode+"</a></td><td>"+data.name+"</td><td>"+data.description+"</td><td>"+data.founder+"</td><td>"+data.msg+"</td></tr>" );

        return e;
    },
    destroy: function(e) {
        e.css({
            'opacity': '0'
        }).matrix({ '4': 500 });
        setTimeout(function() {
            e.remove();
        }, 1000);
    }
});
$.fn.extend({
    matrix: function(params) {
        this.each(function() {
            var str = $(this).css('transform');
            if (!str) return;
            str = str.substring(7);
            str = str.substring(0, str.length - 1);
            var arr = str.split(', ');
            for (var i = 0; i < 6; i++) {
                arr[i] = arr[i] - 0;
            }
            if (params) {
                for (var key in params) {
                    switch (typeof params[key]) {
                        case 'number':
                            arr[key] = params[key];
                            break;
                        case 'string':
                            arr[key] = eval(arr[key] + params[key]);
                            break;
                    }
                }
                str = arr.join(',');
                str = 'matrix(' + str + ')';
                $(this).css('transform', str);
            }
        });
        return this;
    }
});
