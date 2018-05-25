var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var myneb = new Neb();

myneb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));
// myneb.setRequest(new HttpRequest("https://testnet.nebulas.io"));

var account, tx, txhash;

// MainNet
var dappAddress = "n1tfPDdz1g14E5DEM1xQyPbhmkZx6wPA8ZY";

// TestNet
// var dappAddress = "n1dsXaGQcVSnxQXsqYdH6ktCmdGSm9UWUYU";



    document.addEventListener("DOMContentLoaded", function() {
        // $("#search_value").attr("disabled",true)
        // $("#search").attr("disabled",true)

        console.log("web page loaded...")
        setTimeout(checkNebpay,100);

        myneb.api.latestIrreversibleBlock().then(function(blockData) {
        //code
        console.log(JSON.stringify(blockData));

            $("#height").text("Current height: "+blockData.height );

        });

        setTimeout(getACC,100);

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


function getLen() {

// get len
console.log("********* call smart contract by \"call\" *****************")
var func = "len"
//var args = "[\"" + $("#search_value").val() + "\"]"

window.postMessage({
    "target": "contentscript",
    "data":{
        "to" : dappAddress,
        "value" : "0",
        "contract" : {
            "function" : func,
            "args" :null
        }
    },
    "method": "neb_call"
}, "*");

}

var arrs = [];

function init() {
        i = 0;

        for(var i=0;i<arrs.length;i++){

          $.create(arrs[i]);
        }

    $('.main').css('height', $('.container').height() - $('.top').height() + 'px');


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


// function loadTable() {
//
// console.log("********* call smart contract by \"call\" *****************")
// var func = "getAll"
// // var args = "[\"" + $("#search_value").val() + "\"]"
// var args = "1"
//
// window.postMessage({
//   "target": "contentscript",
//   "data":{
//       "to" : dappAddress,
//       "value" : "0",
//       "contract" : {
//           "function" : func,
//           "args" :null
//       }
//   },
//   "method": "neb_call"
// }, "*");
//
//
// }

function find(code) {
console.log("********* call smart contract by \"call\" *****************")
var func = "get"
var args = "[\"" + code + "\"]"

window.postMessage({
  "target": "contentscript",
  "data":{
      "to" : dappAddress,
      "value" : "0",
      "contract" : {
          "function" : func,
          "args" : args
      }
  },
  "method": "neb_call"
}, "*");

}
//$(table).find('tbody').append( "<tr><td>aaaa</td></tr>" );

    // 搜索功能
$("#search").click(function(){
    // $("#search_value").val() 搜索框内的值

    console.log("********* call smart contract by \"call\" *****************")
    var func = "get"
    var args = "[\"" + $("#search_value").val() + "\"]"

    window.postMessage({
        "target": "contentscript",
        "data":{
            "to" : dappAddress,
            "value" : "0",
            "contract" : {
                "function" : func,
                "args" : args
            }
        },
        "method": "neb_call"
    }, "*");

})


// 添加信息功能
$("#add").click(function() {
    $(".result_faile").addClass("hide");
    $(".add_banner").removeClass("hide");

    $("#add_value").val("")
})

$("#save").click(function() {
    console.log("********* call smart contract \"sendTransaction\" *****************")
    var func = "save";
    var account = $("#_id").val();
    var hashcode = $("#hashcode").val();
    var name = $("#name").val();
    var address = $("#address").val();
    var description = $("#description").val();
    var founder = $("#founder").val();
    var msg = $("#msg").val();

    var args = "[\""+account+"\""+","+"\""+hashcode+"\""+","+ "\"" + address + "\""+","+"\""+name+"\""+","+"\""+description+"\""+","+"\""+founder+"\""+","+"\""+msg+"\""+"]";
    // var args = str;

    // console.log("str "+str);
    console.log("args "+args);

    window.postMessage({
        "target": "contentscript",
        "data":{
            "to" : dappAddress,
            "value" : "0",
            "contract" : {
                "function" : func,
                "args" : args
            }
        },
        "method": "neb_sendTransaction"
    }, "*");
})


// listen message from contentscript
window.addEventListener('message', function(e) {
    // e.detail contains the transferred data
    console.log("recived by page:" + e + ", e.data:"+ JSON.stringify(e.data));
    if (!!e.data.data.account){
        //document.getElementById("accountAddress").innerHTML= "Account address: " + e.data.data.account;
        $("#acct").text("Account address: " + e.data.data.account);
        $("#hash").text("Your Address Hashcode: " + getHash(e.data.data.account));

        // generateKey
        // get a random key for item
        $("#hashcode").val(generateKey(e.data.data.account));
        $("#_id").val(e.data.data.account);

        //set default address hash
        $("#address").val(getHash(e.data.data.account));


        console.log("get hashcode: "+generateKey(e.data.data.account));
        //$("#search_value").value(e.data.data.account);

        // account=JSON.stringify(e.data.data.account);
        account=e.data.data.account;


        // get address for current account
        // find(getHash(e.data.data.account));

    }
    if (!!e.data.data.receipt){
        //document.getElementById("txResult").innerHTML = "Transaction Receipt\n" +  JSON.stringify(e.data.data.receipt,null,'\t');
    }
    if (!!e.data.data.neb_call){
        var result = e.data.data.neb_call.result
         console.log("return of rpc call: " + JSON.stringify(result))

        if (result === 'null'){
            $(".add_banner").addClass("hide");
            $(".result_success").addClass("hide");

            // $("#result_faile_add").text($("#search_value").val())
            //
            $(".result_faile").removeClass("hide");

            $("#new").removeClass("hide");

            $("#_id").val(account);


        } else{

            try{
                result = JSON.parse(e.data.data.neb_call.result)


            }catch (err){

            }

            if (!!result.hashcode){
                $(".add_banner").addClass("hide");
                $(".result_faile").addClass("hide");

                // $("#current").removeClass("hide");

                // $("#search_banner").text($("#search_value").val())
                // $("#search_result").text(result.value)
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
});

$.extend({
    create: function(data) {
        var e = $("<div class=\"row\"><div>" + data.hashcode + "</div><div class=right>——" + data.name + "</div></div>");

        // $(theTable).find('tbody').append( "<tr><td id='code'>"+data.hashcode+"</td><td>"+data.name+"</td><td>"+data.description+"</td><td><button id=vote onclick=\"update('"+data.hashcode+"')\">update</button></td></tr>" );
        $(theTable).find('tbody').append( "<tr><td id='code'>"+data.hashcode+"</td><td>"+data.name+"</td><td>"+data.description+"</td><td>"+data.founder+"</td><td>"+data.msg+"</td></tr>" );

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
