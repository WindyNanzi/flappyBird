// 大地
(function(){
	var Land = window.Land = Actor.extend({
		init : function(){
			this.image = game.resource["land"];

			this.x = 0;
			this.y = game.horizon_Y

			this._super();
		},
		update : function(){
			// 这里速度由config中的land_speed调控
			this.x -= game.config.land_speed;
			if( this.x < -1*game.config.img_land_width ){
				this.x = 0;
			}
		},
		render : function(){
			game.ctx.drawImage(this.image,this.x,this.y);
			game.ctx.drawImage(this.image,this.x + game.config.img_land_width,this.y);
			game.ctx.drawImage(this.image,this.x + game.config.img_land_width * 2,this.y);
			game.ctx.fillStyle = game.config.land_color;
			game.ctx.fillRect(0,this.y + game.config.img_land_height,game.game_width,game.game_height- this.y - game.config.img_land_height);
		}
	});
})();