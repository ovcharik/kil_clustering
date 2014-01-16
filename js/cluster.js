var Cluster;

Cluster = (function() {
	function Cluster(point)
	{
		this.color = point.color;
		
		this.points = [];
		this.points.push(point);
		
		this.links = [];
	}
	
	Cluster.prototype.draw = function(canvas)
	{
		var p = this.points[0];
		for (var i = 0; i < this.points.length; i++)
		{
			canvas.drawPoint(this.points[i].x, this.points[i].y, this.color);
			if (p != this.points[i])
				canvas.drawLine(p, this.points[i]);
		}
	}
	
	Cluster.prototype.addLink = function(cluster, length)
	{
		this.links.push({
			cluster: cluster,
			length: length
		});
	}
	
	Cluster.prototype.removeLink = function(cluster)
	{
		for (var i = 0; i < this.links.length; i++)
		{
			if (this.links[i].cluster == cluster)
			{
				this.links.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	
	Cluster.prototype.getLink = function(cluster)
	{
		for (var i = 0; i < this.links.length; i++)
		{
			if (this.links[i].cluster == cluster)
				return this.links[i];
		}
		return false;
	}
	
	Cluster.prototype.setLinkLength = function(cluster, length)
	{
		this.getLink(cluster).length = length;
	}
	
	Cluster.prototype.concat = function(cluster)
	{
		this.points = this.points.concat(cluster.points);
	}
	
	return Cluster;
})();