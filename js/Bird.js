(function(){
	var Bird = window.Bird = Actor.extend({
		init : function(){
			this.bird_no = parseInt(Math.random()*3);
			this.image_no = 0;
			this.image_name = [
				"bird"+this.bird_no+"_0",
				"bird"+this.bird_no+"_1",
				"bird"+this.bird_no+"_2"
			];
			this.image = game.resource[this.image_name[this.image_no]];
			// 初始位置
			this.x = game.bird_X;
			this.y = game.horizon_Y * 0.618 - game.config.img_bird_height / 2;
			// 小鸟的真实高度与宽度
			this.width = game.config.bird_width;
			this.height = game.config.bird_height;
			// 小鸟飞翔初始旋转角度
			this.degree = 0;
			// 小鸟是否向上飞翔
			this.is_fly = false;
			// 是否撞击
			this.is_hit = game.config.bird_is_hit;
			// 是否死亡
			this.is_die = game.config.bird_is_die;
			// 除了游戏场景，其他场景的小鸟仅仅是扇动翅膀，所以需要一个控制变量
			this.is_flappy = game.config.bird_is_flappy;
			// 小鸟的频率
			this.fno = 0;
			this._super();
		},
		update : function(){
			this.is_hit = game.config.bird_is_hit;
			this.is_die = game.config.bird_is_die;
			this.is_flappy = game.config.bird_is_flappy;
			// 小鸟在非撞击和非死亡情况下扇动翅膀
			if(!this.is_die && !this.is_hit){
				//控制小鸟扇动翅膀的频率 
				this.fno % game.config.bird_flappy_fno  === 0 && this.flappy();
			}else{
				this.image = game.resource[this.image_name[1]];
			}
			// 在游玩游戏的场景下,小鸟才会上升和下降
			if(!this.is_flappy && !this.is_die){
				if(this.is_fly){
					// 设置小鸟在固定帧内上向上飞，上飞的距离是递减但是固定的
					this.y -= game.config.bird_fly_percent*(game.config.bird_fly_distance - this.fno);
					
					// 上飞之后准备降落
					if(this.fno == game.config.bird_fly_fno){
						this.is_fly = false;
					}
				}else{
					// 下落时满足下落算法
					this.y += game.config.bird_down_percent * this.fno;
				}
				this.degree += game.config.bird_down_degree;

			}
			
			// 检测天空,碰到天花板就准备下落
			if(this.y < 0){
				this.y = 0;
				this.is_fly = false;
				// 碰到地面直接死亡
			}else if(this.y > game.horizon_Y - game.config.bird_height / 2){
				this.y = game.horizon_Y - game.config.bird_height / 2;
				// π/2
				this.degree = Math.PI / 2;
				this.die();
			}
			this.fno ++;
		},
		render : function(){
			// 这个值在不同场景下会发生改变
			this.x = game.bird_X;
			// 做旋转动画需要移动坐标系的原点，所以要保存旋转前的坐标状态，旋转之后又恢复。这样动画才互不影响
			game.ctx.save();
			game.ctx.translate(this.x ,this.y);
			game.ctx.rotate(this.degree);
			// 由于画布原点已经移动到了预想中小鸟图片中心点的位置，所以绘制的时候将小鸟向左上移动将图片中心点与设置中心点重合
			game.ctx.drawImage(this.image,- game.config.img_bird_width / 2,- game.config.img_bird_height / 2);
			// 添加以下语句可以确定小鸟的位置
			// game.ctx.fillRect(0,0,10,10);
			game.ctx.restore();
		},
		// 扇动翅膀
		flappy : function(){
			this.image_no ++ ;
			if(this.image_no > 2){
				this.image_no = 0;
			}
			this.image = game.resource[this.image_name[this.image_no]];
		},
		// 向上飞
		fly : function(){
			// 首先小鸟下降的频度置零
			this.fno = 0;
			// 设置小鸟每次向上飞时朝上的弧度为0.3
			this.degree = game.config.bird_fly_degree;
			this.is_fly = true;
		},
		die : function(){
			game.config.bird_is_flappy = false ;
			game.config.bird_is_die = true;
			game.config.land_speed = 0;
		},
		getIsDie : function(){
			return this.is_die;
		}
	});
})();