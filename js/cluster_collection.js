var ClusterCollection;

ClusterCollection = (function() {
	function ClusterCollection(canvas, points)
	{
		this.canvas = canvas;
		
		this.clusters = [];
		for (var i = 0; i < points.length; i++)
		{
			this.clusters.push(new Cluster(points[i]));
		}
		
		this.calcMethod = this.methods.singleLink;
		this.iterCounter = 0;
		
		this.initLinks();
	}
	
	ClusterCollection.prototype.initLinks = function()
	{
		for (var i = 0; i < this.clusters.length; i++)
			for (var j = i + 1; j < this.clusters.length; j++)
			{
				var c1 = this.clusters[i],
					c2 = this.clusters[j],
					p1 = c1.points[0],
					p2 = c2.points[0];
				
				l = this.calcLength(p1, p2);
				c1.addLink(c2, l);
				c2.addLink(c1, l);
			}
	}
	
	ClusterCollection.prototype.calcLength = function(p1, p2)
	{
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	}
	
	ClusterCollection.prototype.setClustersCounter = function($el)
	{
		this.$clustersCounter = $el;
		this.updateClustersCounter();
	}
	
	ClusterCollection.prototype.updateClustersCounter = function()
	{
		this.$clustersCounter.val(this.clusters.length);
	}
	
	ClusterCollection.prototype.setIterCounter = function($el)
	{
		this.$iterCounterEl = $el;
		this.updateIterCounter();
	}
	
	ClusterCollection.prototype.updateIterCounter = function()
	{
		this.$iterCounterEl.val(this.iterCounter);
	}
	
	ClusterCollection.prototype.nextIter = function()
	{
		var near = this.findNearClusters();
		
		if (!near)
			throw "Can't find near clusters";
		
		this.clusters.splice(this.clusters.indexOf(near[1]), 1);
		near[0].concat(near[1]);
		for (var i = 0; i < this.clusters.length; i++)
		{
			if (this.clusters[i] == near[0])
				continue;
			
			var l = this.calcMethod(this.clusters[i], near);
			this.clusters[i].setLinkLength(near[0], l);
			near[0].setLinkLength(this.clusters[i], l);
		}
		
		for (var i = 0; i < this.clusters.length; i++)
		{
			var c = this.clusters[i];
			c.removeLink(near[1]);
		}
		
		this.iterCounter++;
		this.updateIterCounter();
		this.updateClustersCounter();
	}
	
	ClusterCollection.prototype.findNearClusters = function()
	{
		if (this.clusters.length > 1)
		{
			var min_c1, min_c2, min_l;
			for (var i = 0; i < this.clusters.length; i++)
				for (var j = i + 1; j < this.clusters.length; j++)
				{
					var c1 = this.clusters[i],
						c2 = this.clusters[j],
						l = c1.getLink(c2).length;
						if (min_l == undefined || l < min_l)
						{
							min_c1 = c1;
							min_c2 = c2;
							min_l = l;
						}
				}
			return [min_c1, min_c2];
		}
		
		return false;
	}
	
	ClusterCollection.prototype.setCalcMethod = function(name)
	{
		this.calcMethod = this.methods[name];
	}
	
	ClusterCollection.prototype.draw = function()
	{
		this.canvas.clear();
		for (var i = 0; i < this.clusters.length; i++)
		{
			this.clusters[i].draw(this.canvas);
		}
	}
	
	ClusterCollection.prototype.methods = {
		singleLink: function(from, to)
		{
			var min, c;
			for (var i = 0; i < to.length; i++)
			{
				c = from.getLink(to[i]).length;
				if (min === undefined || c < min)
					min = c;
			}
			return min;
		},
		
		completeLink: function(from, to)
		{
			var max, c;
			for (var i = 0; i < to.length; i++)
			{
				c = from.getLink(to[i]).length;
				if (max === undefined || c > max)
					max = c;
			}
			return max;
		},
		
		groupAverage: function(from, to)
		{
			var sum = 0;
			for (var i = 0; i < to.length; i++)
			{
				sum += from.getLink(to[i]).length;
			}
			return sum / to.length;
		}
	}
	
	return ClusterCollection;
})();