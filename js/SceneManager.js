// 场景管理类
// 它负责页面的更新与渲染，同时有独立的enter方法,方便进行场景切换
(function(){
	var SceneManager = window.SceneManager = Class.extend({
		init : function(){
			// 设置场景编号
			this.scene_no = 1;
			this.tips = ["title","text_ready","text_game_over"];
			this.tip_name = this.tips[0];
			this.tip = {};
			this.center_X = game.game_width / 2;
			this.button_play = game.resource["button_play"];
			this.button_play_X =this.center_X - game.config.button_play_width / 2;
			this.button_play_Y = game.horizon_Y - game.config.button_play_height;
			this.tutorial = game.resource["tutorial"];
			this.tutorial_X = this.center_X - game.config.tutorial_width / 2;
			this.tutorial_Y = game.horizon_Y * 0.618 - game.config.tutorial_height / 2;
			this.score_panel = game.resource["score_panel"];
			this.score_panel_X = this.center_X - game.config.score_panel_width / 2;
			this.score_panel_Y = game.game_height * 0.618 - game.config.score_panel_height ;
			this.fno = 0;
			this.enter();
		},
		render : function(){
			// 渲染game类中的所有元素
			for(var i=0,len = game.actors.length;i<len;i++){
				game.actors[i] && game.actors[i].update();
				game.actors[i] && game.actors[i].render();
			}
			switch(this.scene_no){
				case 1:
					this.tips_name = this.tips[0];
					this.tip = game.resource[this.tips_name];
					this.tip.width = game.config[this.tips_name+"_width"];
					this.tip.height = game.config[this.tips_name+"_height"];
					game.ctx.drawImage(this.tip, this.center_X - this.tip.width / 2,game.horizon_Y * 0.382 - this.tip.height);
					game.ctx.drawImage(this.button_play, this.button_play_X ,this.button_play_Y);
					break;
				case 2:
					this.tips_name = this.tips[1];
					this.tip = game.resource[this.tips_name];
					this.tip.width = game.config[this.tips_name+"_width"];
					this.tip.height = game.config[this.tips_name+"_height"];
					game.ctx.drawImage(this.tip, this.center_X - this.tip.width / 2,game.horizon_Y * 0.382 - this.tip.height);
					game.ctx.drawImage(this.tutorial, this.tutorial_X , this.tutorial_Y);
					game.ctx.drawImage(game.resource["number0"] , this.center_X - game.config.big_number_width / 2 , game.game_height * game.config.score_Y);
					break;
				case 3:
					// 每隔一段距离添加一根柱子
					parseInt((this.fno * game.config.land_speed ) / game.config.pipe_group_betwenn_distance ) > game.config.last_pipe_no  && new Pipe();
					var scoreLength = game.score.toString().length;
					for(var i = 0;i<scoreLength;i++){
						// 根据分数的位数来设置分数图片的位置，距离中线然后向左偏移一半的位数
						game.ctx.drawImage(game.resource["number" + game.score.toString().charAt(i)],this.center_X - game.config.big_number_width*(scoreLength / 2) + 27*i,game.game_height * game.config.score_Y);
					}
					// 直接根据小鸟是否死亡
					if(game.bird.getIsDie()){
						this.scene_no = 4;
						this.enter();
					}
					this.fno ++;
					break;
				case 4:
					this.tips_name = this.tips[2];
					this.tip = game.resource[this.tips_name];
					this.tip.width = game.config[this.tips_name+"_width"];
					this.tip.height = game.config[this.tips_name+"_height"];
					game.ctx.drawImage(this.tip, this.center_X - this.tip.width / 2,game.horizon_Y * 0.382 - this.tip.height);
					game.ctx.drawImage(this.score_panel,this.score_panel_X,this.score_panel_Y);
					game.ctx.drawImage(this.button_play, this.button_play_X ,this.button_play_Y);

					var scoreLength = game.score.toString().length;
					for(var i = 0;i<scoreLength;i++){
						game.ctx.drawImage(game.resource["number_score" + game.score.toString().charAt(i)],this.score_panel_X + 195 - game.config.small_number_width*(scoreLength / 2) + 10*i,this.score_panel_Y+36);
					}
					if(game.score > localStorage.getItem("best_score")){
						game.best_score = localStorage.setItem("best_score",game.score);
					}
					var best_score_length = localStorage.getItem("best_score").toString().length;
					for(var i = 0;i<best_score_length;i++){
						game.ctx.drawImage(game.resource["number_score" + localStorage.getItem("best_score").toString().charAt(i)],this.score_panel_X + 195 - game.config.small_number_width*(best_score_length / 2) + 10*i,this.score_panel_Y+75);
					}
					break;

				default:
					break;
				
			}
		},
		// 负责为场景更改动画元素与参数设置
		enter : function(){
			switch(this.scene_no){
				case 1:
					// 元素
					
					new Background();
					game.actors.push( game.pipes );
					game.bird = new Bird();
					new Land();

					// 参数
					game.config.bird_is_flappy = true;
					game.bird_X = game.game_width / 2;
					game.config.bird_flappy_fno = 7;
					break;
				case 2:
					//元素 
					game.actors.length = 0;
					game.pipes.length = 0;
					new Background();
					game.actors.push( game.pipes );
					game.bird = new Bird();
					new Land();

					// 参数
					// 小鸟扇动翅膀
					game.config.bird_is_flappy = true;
					// 小鸟横坐标定位
					game.bird_X = game.game_width * 0.382;
					// 地面恢复速度
					game.config.land_speed = 5;
					// 重新计分
					game.score = 0;
					// 重新计算管道序号
					game.config.last_pipe_no = 0;
					game.config.bird_is_hit = false;
					game.config.bird_is_die = false;

					break;
					// 场景2到场景5基本没有新元素添加进来
				case 3:
					this.fno = 0;
					game.bird.fno = 0;
					game.config.bird_is_flappy = false;
					game.config.bird_flappy_fno = 3;
					
					break;
				case 4:
					break;
				default :
					break;

			}
			this.bindEvent();
		},
		// 需要为每一个场景添加监听事件
		bindEvent : function(){
			var self = this;
			game.canvas.onclick = function(event){
				// 利用相对坐标要更为准确一些。它是相对于画布而言
				var mouse_X = event.offsetX;
					mouse_Y = event.offsetY;
				switch(self.scene_no){
					case 1:
						if(mouse_X >= self.button_play_X && mouse_X <= self.button_play_X + game.config.button_play_width && mouse_Y >= self.button_play_Y && mouse_Y <= self.button_play_Y + game.config.button_play_height){
							self.scene_no = 2;
							self.enter();
						}
						break;
					case 2:
						self.scene_no = 3;
						self.enter();
						break;
					case 3:
						// 没有撞到就还可以飞
						!game.config.bird_is_hit && game.bird.fly();
						break;
					case 4:
						if(mouse_X >= self.button_play_X && mouse_X <= self.button_play_X + game.config.button_play_width && mouse_Y >= self.button_play_Y && mouse_Y <= self.button_play_Y + game.config.button_play_height){
							self.scene_no = 2;
							self.enter();
						}
						break;
					default :
						break;
				}
			}
		}
	});
})();