// Actor为所有演员的父类
(function(){
	var Actor = window.Actor = Class.extend({
		init : function(){
			game.actors.push(this);
		},
		update : function(){
			// 有点演员不含有变化，故而不需要update函数
		},
		render : function(){
			throw new Error("必须重写render方法！");
		}
	});
})();