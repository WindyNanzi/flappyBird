// 利用中介者模式实现类与类之间的通信
// Game类中包含的都是全局变量
// Game类负责游戏初始化(资源加载，参数设置)，类与类之间的通讯，后期还涉及场景的管理
(function(){
	var Game = window.Game = Class.extend({
		init : function(canvas_id){
			this.canvas = document.querySelector(canvas_id);
			this.ctx  = this.canvas.getContext('2d');
			// 配置文件路径
			this.config_url = "config.json";
			// 资源文件路径
			this.resource_url = "resource.json";
			this.config = {};
			this.resource_obj = {};
			this.resource = {};
			// 游戏画布的宽高
			this.game_width = document.documentElement.clientWidth;
			this.game_height = document.documentElement.clientHeight;
			// 演员数组
			this.actors = [];
			// 地平线的Y轴是一个固定的值，所以可以将其单独提出来
			this.horizon_Y = 0;
			// 管道作为一个特殊的类，我们需要将其单独提出来
			this.pipes = [];
			// 小鸟的横坐标是个固定值，但是需要根据屏幕进行调整，所以放在Game类
			this.bird_X = 0;
			// 游戏的分数
			this.score = 0;
			// 最高分
			localStorage.setItem("best_score",0);
			this.load();
		},
		load : function(){
			var self = this;
			

			// 加载参数文件
			Ajax({
				"method" : 'GET',
				"url" : "config.json",
				"async" : true
			}).then(function(text){
				
				self.config = JSON.parse(text);
				// 设置各种参数
				self.setConfig();
				// 提示用户加载资源
				self.ctx.textAlign = "center";
				self.ctx.font = "30px 微软雅黑";
				// 0.382+黄金分割数0.618  = 1
				self.ctx.fillText("正在加载游戏资源...",self.game_width/2,self.game_height*0.382);
				//加载完配置之后引入资源文件
				return Ajax({
					"method" : "GET",
					"url" : "resource.json",
					"async" : true
				});
			}).then(function(text){
				self.resource_obj = JSON.parse(text);
				// 载入图片资源
				// 图片计时器
				var count = 0,
					// 图片的数目
					image_count = Object.keys(self.resource_obj.images).length;
				for(k in self.resource_obj.images){
					self.resource[k] = new Image();
					self.resource[k].src = self.resource_obj.images[k];
					self.resource[k].onload = function(){
						count ++ ;
						self.ctx.clearRect(0,0,self.game_width,self.game_height);
						self.ctx.fillText("正在加载图片"+count+"/"+image_count,self.game_width/2,self.game_height*0.382);
						if (count == image_count) {
							// 目前图片加载完成即可开始游戏
							self.start();
						}
					}
				}
			}).catch(function(status){
				console.log(status);
			})
		},
		setConfig : function(){
			var self = this;
			// 首先根据屏幕大小设置游戏画布的宽高
			if(self.game_width > self.config.window_max_width ){
				self.game_width = self.config.window_max_width;
			}else if(self.game_width < self.config.window_min_width){
				self.game_width = self.config.window_min_width;
			}
			if(self.game_height > self.config.window_max_height){
				self.game_height = self.config.window_max_height;
			}else if(self.game_height < self.config.window_min_height){
				self.game_height = self.config.window_min_height;
			}
			self.canvas.width = self.game_width;
			self.canvas.height = self.game_height;

			// 设置地平线的高度; img_bg_proportionY 是天空到地平线的距离占整个画布高度的百分比
			self.horizon_Y = self.game_height * self.config.img_bg_proportionY;

			// 0.382是黄金比例数，设置完画布的长宽后可以对小鸟的横坐标进行设置
			self.bird_X = self.game_width * 0.382 - self.config.img_bird_width / 2;


			// 为管道数组添加render方法与update方法
			self.pipes.render = function(){
				// 通过配置文件中的len来调控数组
				var len = self.config.pipe_arr_length;
				for(var i = 0; i < len; i++){
					self.pipes[i] && self.pipes[i].render();
				}
			}
			self.pipes.update = function(){
				var len = self.config.pipe_arr_length;
				for(var i = 0; i < len; i++){
					self.pipes[i] && self.pipes[i].update();
				}
			}
		},
		start : function(){
			var self = this;
			var scene_manager = new SceneManager();

			self.timer = setInterval(function(){
				self.ctx.clearRect(0,0,self.game_width,self.game_height);
				scene_manager.render();
			},self.config.game_fno);
		}
	});
})();