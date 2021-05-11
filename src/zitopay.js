import { LocalStorageSetLoadedStatus } from "./data/LocalStorageSetLoadedStatus";
import React from "react";

function isObject(obj) {
    return obj === Object(obj) && "[object Array]" !== Object.prototype.toString.call(obj)
}

function isArray(value) { return value.constructor === Array; }

function isFunction(functionToCheck) {
    if (!functionToCheck) return !1;
    var getType = {};
    return functionToCheck && "[object Function]" === getType.toString.call(functionToCheck)
}

function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

function isValidURL(url) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
}

function isValidUsername(username) { return /^([a-zA-Z]+[a-zA-Z0-9 _\-]+)$/.test(username); }

export var Zitopay = function () {
    return {
        log_error: function (str) {
            window.console && console.error(str);
            return str;
        },
        log_info: function (str) {
            window.console && console.log(str);
            return str;
        },
        pay: function (options, inline_display) {
            LocalStorageSetLoadedStatus(false);
            if (typeof inline_display === 'undefined') inline_display = false;

            if (!options) return this.log_error("Valid Payment Options Not Supplied", options);

            var tempOnClose = function () { };
            var tempOnDone = function (result) { };
            var tempOnLoad = function () { };

            var all_attrs = 'receiver,amount,currency,ref,memo,email,notification_url,success_url,cancel_url,firstname,lastname,phone,country,trust_token,receiver2,receiver3,sf,availability_keywords,button_text,compositeform,theme_color,preset_amount1,preset_amount2,preset_amount3,success_endpoint,cancel_endpoint'.split(',');
            if (!options.receiver && typeof options.getAttribute === 'function') {
                var options2 = {};
                var tk = null, tk2 = null, temp = null;

                for (let i in all_attrs) {
                    tk = all_attrs[i];
                    tk2 = 'data-' + tk;
                    if (options.hasAttribute(tk2)) options2[tk] = options.getAttribute(tk2);
                }

                if (typeof options.getAttribute === 'function') {
                    var temp = options.getAttribute('data-onClose');
                    if (typeof temp != 'function' && typeof window[temp] == 'function') {
                        tempOnClose = window[temp];
                    }

                    temp = options.getAttribute('data-onDone');
                    if (typeof temp != 'function' && typeof window[temp] == 'function') {
                        tempOnDone = window[temp];
                    }

                    temp = options.getAttribute('data-onLoad');
                    if (typeof temp != 'function' && typeof window[temp] == 'function') {
                        tempOnLoad = window[temp];
                    }
                }

                options = options2; options2 = null;
                var temp_ref = options.ref || 0;

                if (options.success_url) {
                    options.onDone = function (response) {
                        var tempu = options.success_url;
                        var append = 'zitopay_transaction_reference=&ref=' + response.ref;
                        var pos = tempu.indexOf('?');
                        if (pos != -1) tempu = tempu.substr(0, pos + 1) + append + '&' + tempu.substr(pos + 1);
                        else {
                            pos = tempu.indexOf('#');
                            if (pos != -1) tempu = tempu.substr(0, pos) + '?' + append + tempu.substr(pos);
                            else tempu = tempu + '?' + append;
                        }

                        if (tempu.indexOf('compositeform') == -1) window.location.href = tempu;
                        //else console.log('not redirecting:',tempu);
                    }
                }

                if (options.cancel_url) {
                    options.onClose = function (msg) {
                        window.console && console.log('Payment widget closed. ' + msg);

                        var tempu = options.cancel_url;
                        var append = 'ref=' + temp_ref;
                        var pos = tempu.indexOf('?');
                        if (pos != -1) tempu = tempu.substr(0, pos + 1) + append + '&' + tempu.substr(pos + 1);
                        else {
                            pos = tempu.indexOf('#');
                            if (pos != -1) tempu = tempu.substr(0, pos) + '?' + append + tempu.substr(pos);
                            else tempu = tempu + '?' + append;
                        }

                        if (tempu.indexOf('compositeform=1') == -1) window.location.href = tempu;
                        //else console.log('not redirecting:',tempu);
                    }
                }
            }

            let params = {}; var tk = null;
            for (let i in all_attrs) {
                tk = all_attrs[i];
                params[tk] = options[tk] || '';
            }

            var is_composite = (typeof params.compositeform !== 'undefined' && params.compositeform);

            if (params.amount * 1 <= 0 && !is_composite) return this.log_error('ZitoPay initiation failed! Invalid amount:' + params.amount);
            if (!/^[A-Z]{3}$/.test(params.currency) && !is_composite) return this.log_error('ZitoPay initiation failed! Invalid currency, it must be 3 uppercase alphabets');
            if (params.receiver == '' || (!isValidEmail(params.receiver) && !isValidUsername(params.receiver))) return this.log_error('ZitoPay initiation failed! Invalid receiver email or username ' + params.receiver);
            if (params.email != '' && !isValidEmail(params.email)) return this.log_error('ZitoPay initiation failed! Invalid payeer email ' + params.email);
            //if(params.notification_url!=''&&!isValidURL(params.notification_url))return this.log_error('Invalid notification_url '+params.notification_url);
            //if(params.success_url!=''&&!isValidURL(params.success_url))return this.log_error('Invalid success_url '+params.success_url);
            //if(params.cancel_url!=''&&!isValidURL(params.cancel_url))return this.log_error('Invalid cancel_url '+params.cancel_url);

            var functions = {
                onClose: options.onClose || tempOnClose,
                onDone: options.onDone || tempOnDone,
                onLoad: options.onLoad || tempOnLoad
            }

            if (!isFunction(functions.onClose)) return this.log_error('ZitoPay: onClose callback is not a function');
            if (!isFunction(functions.onDone)) return this.log_error('ZitoPay: onDone callback is not a function');
            if (!isFunction(functions.onLoad)) return this.log_error('ZitoPay: onLoad callback is not a function');

            window['zitopayDone'] = functions.onDone;
            window['zitopayClose'] = functions.onClose;

            var temp_url = 'popup=1';
            if (inline_display) temp_url += '&inline_display=1';
            for (let pk in params) temp_url += '&' + pk + '=' + encodeURIComponent(params[pk]); //encodeURI()
            var temp_prot = (window.location.protocol == 'https:') ? 'https:' : 'http:';

            //if(true)temp_url=temp_prot+'//tormuto.com/zitopay.africa/sci?'+temp_url; else
            temp_url = temp_prot + '//zitopay.africa/sci?' + temp_url;
            // error in the line of code below
            // remove the localhost from the url below so that temp_url = "https://zitopay.africa.sci? ..." temp_prot + '//zitopay.africa/sci?' +
            if (window.location.hostname == 'localhost') { temp_url = temp_url; console.log(temp_url) }

            if (inline_display) return temp_url;

            if (document.getElementById('zitopayPaymentIframe')) {
                if (document.getElementById('zitopayPaymentOverlay')) {
                    document.getElementById('zitopayPaymentOverlay').style.display = 'block';
                }
                document.getElementById('zitopayLoading').innerHTML = 'Loading...';

                var prev_src = document.getElementById('zitopayPaymentIframe').src;
                //if(prev_src!=temp_url){
                document.getElementById('zitopayPaymentIframe').style.display = 'none';
                document.getElementById('zitopayLoading').style.display = 'block';
                document.getElementById('zitopayPaymentIframe').src = temp_url;
                // document.getElementById(`first_pay_button`).style.backgroundColor=`#e2531e`
                //}
            } else {
                var temphstr = '100vh';
                if (document.body && document.body.scrollHeight) {
                    var temph = document.body.scrollHeight;
                    if (temph < 680) temph = 680;
                    temphstr = temph + 'px;'
                }

                var styles = "@media (max-width:400px) {" +
                    "#zitopayPaymentIframe{" +
                    "width:94% !important;left:2% !important; height:130vh !important;" +
                    "}" +
                    "#zitopayCloseToggler{left:2% !important;}" +
                    "}";
                var css = document.createElement('style');
                css.type = 'text/css';
                css.id = 'zitopayCSS';
                if (css.styleSheet) css.styleSheet.cssText = styles;
                else css.appendChild(document.createTextNode(styles));
                document.getElementsByTagName("head")[0].appendChild(css);

                var cssText = 'position:absolute;width:100%;min-width:98vw;height:' + temphstr + ';top:0px;left:0px;padding-top:10px;background-color:rgba(25, 20, 67,0.7);text-align:center;';
                var overlay = document.createElement("div");
                overlay.style.cssText = cssText;
                overlay.id = 'zitopayPaymentOverlay';
                // document.body.appendChild(overlay);
                //show, Loading payment scree, please wait..

                cssText = 'position:absolute;color:#ff9900;cursor:pointer;font-weight:bold;font-size:120%;top:25px;left:10%;';
                var closeSpan = document.createElement("span");
                closeSpan.onclick = function () {
                    zitopayCloseBuffer('Closed by user');
                };
                closeSpan.innerHTML = '<ion-spinner size="large" ></ion-spinner>';
                closeSpan.style.cssText = cssText;
                closeSpan.id = 'zitopayCloseToggler';
                document.getElementById('zitopayDiv').appendChild(closeSpan);

                cssText = 'position:absolute;z-index:2;color:#ffffff;font-weight:bold;font-size:200%;top:30%;left:0px;width:100%;text-align:center;'
                var loadingSpan = document.createElement("h1");
                loadingSpan.innerHTML = 'Loading...';
                loadingSpan.style.cssText = cssText;
                loadingSpan.id = 'zitopayLoading';
                document.getElementById('zitopayDiv').appendChild(loadingSpan);

                cssText = 'position:relative;width:80%;left:10%;top:10px;min-width:280px;max-width:100vw;min-height:650px;overflow-x:hidden;';
                var iframe = document.createElement("iframe");
                iframe.setAttribute("frameBorder", "0");
                iframe.style.cssText = cssText;
                iframe.id = iframe.name = 'zitopayPaymentIframe';
                iframe.src = temp_url;
                document.getElementById(`zitopayDiv`).appendChild(iframe);
                // document.getElementById('zitopayPaymentOverlay').appendChild(iframe);

                iframe.onload = function () {
                    //hide Loading payment screen page.
                    functions.onLoad();
                    document.getElementById('zitopayLoading').style.display = 'none';
                    document.getElementById('zitopayPaymentIframe').style.display = 'block';
                    LocalStorageSetLoadedStatus(true);
                 

                    var temp = document.getElementById('zitopayPaymentIframe');
                    window.scrollTo(0, temp.offsetTop);
                }

                iframe.onerror = function (e) {
                    document.getElementById('loadingSpan').innerHTML = 'Unable to load ZitoPay. Please check your connection. ' + e;
                }
            }

        },
        displayInlines: function () {
            document.querySelectorAll('.pay-inline-with-zitopay:not(.treated)').forEach(function (item) {
                var temp_url = Zitopay.pay(item, true);
                var error = '';
                if (!temp_url) error = "Error initiating payment interface.";
                else {
                    var pre = temp_url.substr(0, 2);
                    if (pre != '//' && pre != 'ht') error = temp_url;
                    else {
                        //var rand = Date.now();
                        var rand = Math.floor(Math.random() * 1000)
                        var str = "<iframe frameBorder='0' name='zitopayIframe_" + rand + "' style='width:100%;overflow:auto;' src='" + temp_url + "'></iframe>";
                        item.innerHTML = str;
                    }
                }
                if (error != '') item.innerHTML = "<div style='color:#ff0000;'>" + error + "</div>";
                item.classList.add('treated');
            });
        },
        closePopup: function () {
            var ol = document.getElementById('zitopayPaymentOverlay');
            if (ol) ol.style.display = 'none';
        }
    }
}();

window.Zitopay = Zitopay;


if (window.addEventListener) window.addEventListener("message", onZitopayMessage, false);
else if (window.attachEvent) window.attachEvent("onmessage", onZitopayMessage, false);

function onZitopayMessage(event) {
    // Check sender origin
    var protocol = window.location.protocol;
    var slashes = protocol.concat("//");
    var host = slashes.concat(window.location.hostname);

    if (event.origin !== host && event.origin !== "https://zitopay.africa") {
        window.console && console.error('Invalid origin ' + event.origin);
        return;
    }

    var data = event.data;

    if (typeof (window[data.func]) == "function") {
        //window[data.func].call(null, data.message);
        if (data.func == 'zitopayDoneBuffer') zitopayDoneBuffer(data.message);
        else if (data.func == 'zitopayCloseBuffer') zitopayCloseBuffer(data.message);
        else if (data.func == 'resizePaymentIframe') resizePaymentIframe(document.querySelector(data.message), data.height);
        else window.console && console.error('No permission to call other function ' + data.func + '()');
    }
}

// called from iframe
function zitopayDoneBuffer(message) {
    if (typeof window['zitopayDone'] == 'function')
        window['zitopayDone'](JSON.parse(message));
    else {
        window.console && console.error('No event registered for ondone');
        window.console && console.error(message);
    }
}

function zitopayCloseBuffer(message) {
    document.getElementById('zitopayPaymentOverlay').style.display = 'none';
    if (typeof window['zitopayClose'] == 'function')
        window['zitopayClose'](message);
    else {
        window.console && console.error('No event registered for onClose');
        window.console && console.error(message);
    }
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('pay-with-zitopay')) Zitopay.pay(e.target);
});

setTimeout(function () { Zitopay.displayInlines(); }, 1);

/*
window.addEventListener('resize',function(){
    var all=document.querySelectorAll('.pay-inline-with-zitopay iframe');
    if(all&&all.length)for(var e of all)resizePaymentIframe(e);
});
*/
function resizePaymentIframe(iframe, height) { if (height > 1) iframe.height = height + "px"; }
