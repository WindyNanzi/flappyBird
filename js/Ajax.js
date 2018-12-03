// 这里利用promise对象简化一下Ajax的异步操作
// 由于游戏只用到Get请求，故而不添加post方法参数的解析方法
// 简单的做一个Ajax封装
(function(){
	var Ajax = window.Ajax = function(options) {
	    var xhr = new XMLHttpRequest();
	    return new Promise(function (resolve, reject) {
	        xhr.onreadystatechange = function () {
	        	// 如果直接判断 xhr.readyState === 4 && xhr.status === 200 
	        	// 则会出现弹出 0 XMLHttpRequest对象还没有完成初始化
	            if (xhr.readyState === 4 ) {
	                if(xhr.status === 200){
	                    resolve(xhr.responseText);
	                } else {
	                    reject(xhr.status);
	                }
	            }
	        };
	        xhr.open(options.method,options.url,options.async);
	        xhr.send(null);
	    });
	}
})();