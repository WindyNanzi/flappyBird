(function(){
	var Pipe = window.Pipe = Actor.extend({
		init : function(){
			this.pipe_down = game.resource["pipe_down"];
			this.pipe_up = game.resource["pipe_up"];
			// 每一组管子之间的距离是相等的
			this.pipe_between_space = game.config.pipe_between_distance;
			// 随机一个高度，这个高度应该满足一个区间，区间应当对上对下的高度分配差不多,最小高度应该为另外一边恰好为一边管子图片的最大高度时
			var pipe_min_height = game.game_height - game.config.pipe_height -game.config.pipe_between_distance;
			this.pipe_down_height = pipe_min_height + parseInt(Math.random()*(game.config.pipe_height - pipe_min_height));
			this.pipe_up_height = game.horizon_Y - this.pipe_down_height - game.config.pipe_between_distance;

			// 设置管子长宽
			this.width = game.config.pipe_width;
			this.height = game.config.pipe_height;
			//管子出现的位置 原始设置为1.5的屏幕宽长度
			this.x = game.game_width * game.config.first_pipe_appear;
			
			
			// this._super();
			game.pipes.push(this);
			game.config.pipe_arr_length ++;
			game.config.last_pipe_no ++ ;
		},
		update : function(){
			// 管子速度和大地滚动速度应该一致
			this.x -= game.config.land_speed;
			// 在管子完全经过：即当前管子的宽度+ 管子组与管子组之间的距离时，删除管子
			// 否则弹出管子之后画面会存在一定的停顿
			if(this.x <=  -(game.config.pipe_width + game.config.land_speed * game.config.pipe_appear_fno)){
				this.die();
			}

			// 需要对鸟进行碰撞检测,小鸟的x值是固定不变的
			// 首先判断小鸟是否在管子中间
			if(game.bird_X + game.config.bird_width / 2 >= this.x && game.bird_X - game.config.bird_width / 2 <= this.x + this.width){
				if(game.bird.y - game.config.bird_height / 2  > this.pipe_down_height && game.bird.y + game.config.bird_height / 2 < this.pipe_down_height + game.config.pipe_between_distance ){
					// AABB盒碰撞检测，检测是否碰撞是看紧紧裹着小鸟的矩形的四条边进行碰撞检测
					// game.config.bird_height/2 是小鸟的中心点距离小鸟的肚皮（底边）的距离
				}else{
					game.config.land_speed = 0;
					game.config.bird_is_hit = true;
				}
			}
			if(game.bird_X + game.config.bird_width / 2 >= this.x + this.width && !this.is_bird_passed){
				this.is_bird_passed = true;
				game.score ++ ;
			}
		},
		render : function(){
			// 画图时应当对图片进行切取
			game.ctx.drawImage(this.pipe_down,0,this.height-this.pipe_down_height,this.width,this.pipe_down_height, this.x ,0,this.width,this.pipe_down_height);
			game.ctx.drawImage(this.pipe_up,0,0,this.width,this.pipe_up_height, this.x ,this.pipe_down_height + game.config.pipe_between_distance,this.width,this.pipe_up_height);
		},
		die : function(){
			 game.pipes.shift();
			 game.config.pipe_arr_length --;
		}
	});	
})();