(function(){
	var Background = window.Background = Actor.extend({
		init : function(){
			// 随机选择一张背景图
			var image_no = parseInt(Math.random()*2);
			var image_name = "bg_day";
			// 设置猫腻矩形的背景色
			this.sky_color = game.config.day_color;
			if(image_no == 1){
				image_name = "bg_night";
				this.sky_color = game.config.night_color;
			}
			this.image = game.resource[image_name];
			// 设置图片的位置
			// 横坐标为 0,我们想让图片的地平线在整个游戏画布的垂直方向百分比位置,如0.8,
			// 需要将画布中天空到地平线的高度减去图片中天空到地平线的高度的值设置为绘制的 Y轴初始值
			// img_bg_horizon为图片中天空到大地之间的距离
			this.x = 0;
			this.y = game.horizon_Y - game.config.img_bg_horizon;

			this._super();
		},
		update : function(){

		},
		render : function(){
			// 绘制猫腻矩形
			game.ctx.fillStyle = this.sky_color;
			// 计算可能存在一定误差
			game.ctx.fillRect(0,0,game.game_width,this.y+1);
			game.ctx.drawImage(this.image,this.x,this.y);
			game.ctx.drawImage(this.image,this.x + game.config.img_bg_width,this.y);
			game.ctx.drawImage(this.image,this.x + game.config.img_bg_width * 2,this.y);
		}
	});
})();