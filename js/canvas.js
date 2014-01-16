var Canvas;

Canvas = (function() {
	function Canvas(id, width, height)
	{
		this.width = width || 256;
		this.height = height || 256;
		
		this.id = id;
		this.el = document.getElementById(this.id);
		this.context = this.el.getContext('2d');
		
		this.scale = {
			x: 1,
			y: 1
		}
		
		this.onResize();
	}
	
	Canvas.prototype.clear = function()
	{
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0, this.realWidth(), this.realHeight());
	}
	
	Canvas.prototype.drawPoint = function(x, y, color, radius)
	{
		radius = radius || 3.5;
		
		if (typeof(x) == "object")
		{
			y = x.y;
			color = x.color;
			x = x.x;
		}
		
		var r, g, b, c, point;
		if (typeof(color) == "number")
		{
			r = (color >> 16) & 0xFF;
			g = (color >>  8) & 0xFF;
			b = (color >>  0) & 0xFF;
			c = "rgb(" + r + ", " + g + ", " + b + ")";
		}
		else if (typeof(color) == "object")
			c = "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")";
		else if (typeof(color) == "string")
			c = color;
		else
			throw "Wrong color";
		
		point = this.getPoint(x, y);
		
		this.context.strokeStyle = "black";
		this.context.lineWidth = 0.3;
		this.context.fillStyle = c;
		this.context.beginPath();
		this.context.arc(point.x, point.y, radius, 0, 2 * Math.PI);
		this.context.closePath();
		this.context.fill();
		this.context.stroke();
	}
	
	Canvas.prototype.drawLine = function(x1, y1, x2, y2)
	{
		if (typeof(x1) == "object" && typeof(y1) == "object")
		{
			y2 = y1.y;
			x2 = y1.x;
			y1 = x1.y;
			x1 = x1.x;
		}
		
		var p1 = this.getPoint(x1, y1),
			p2 = this.getPoint(x2, y2);
		
		this.context.strokeStyle = "black";
		this.context.lineWidth = 1;
		this.context.beginPath();
		this.context.moveTo(p1.x, p1.y);
		this.context.lineTo(p2.x, p2.y);
		this.context.stroke();
	}
	
	Canvas.prototype.getPoint = function(x, y)
	{
		return {
			x: x * this.scale.x,
			y: y * this.scale.y
		}
	}
	
	Canvas.prototype.realWidth = function()
	{
		return this.el.width;
	}
	
	Canvas.prototype.realHeight = function()
	{
		return this.el.height;
	}
	
	Canvas.prototype.onResize = function()
	{
		this.scale.x = this.realWidth() / this.width;
		this.scale.y = this.realHeight() / this.height;
		this.clear();
	}
	
	return Canvas;
})();
