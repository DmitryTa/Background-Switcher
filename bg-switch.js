function BgSwitcher(options) {
	this._elem = options.elem;
 	var time = this._time = options.time || null;
	this.currentSlide = 0;
	this._timerId;
	this._elem.style.transition = 'background 1.6s ease'
	
	 self = this;
	 
	 // preload
	 
	var loaded = this._loaded  = [];

	options.URL.forEach(function(url) {
		img = document.createElement('img');
		img.setAttribute('src', url);
		img.addEventListener('load', addLoaded);
	})

	function addLoaded() {
		console.log(this.src + ' loaded')
		loaded.push(this.src);
	}

	if (time) {
		this.start(); 
	}
}

BgSwitcher.prototype.isRunning = function() {
	return !!this._timerId;
};

BgSwitcher.prototype.stop = function() {
	clearInterval(this._timerId);
	this._timerId = null
}


BgSwitcher.prototype.start = function() {

	if (this.isRunning()) return;

	progress.style.animationDuration = this._time/1000 + 's'
	var self = this	
	this._timerId = setInterval(function() {
		self.nextSlide();
		//animateWith(progress, 'animation-progress', false)
	},this._time);

	// for immediate action
	self.nextSlide();
	//animateWith(progress, 'animation-progress', false)


	function animateWith(elem, animClassCss, removeAfterAnim) {
		if (elem.classList.contains(animClassCss)) elem.classList.remove(animClassCss);

			setTimeout(function() { 
				elem.classList.add(animClassCss);
			},0)  

		var animTime = parseFloat(getComputedStyle(elem).animationDuration) * 1000;

		if (removeAfterAnim) {
			setTimeout(function() {
				elem.classList.remove(animClassCss);
			}, animTime);
		}

		return animTime;
  	}
}

BgSwitcher.prototype.nextSlide = function() {

	try {

		if (this._loaded.length < 2) {
			throw new SliderError('no img loaded')
		}

		this.currentSlide++;
		if (this.currentSlide > this._loaded.length -1) this.currentSlide = 0;

		this._elem.style.backgroundImage = 'url('+this._loaded[this.currentSlide]+')';

		
		// create and send Event to this._elem
		
		var sliderEvent = new CustomEvent("changeSlide", {
	      bubbles: true
	    });

	    this._elem.dispatchEvent(sliderEvent);
		
	} catch(err) {
		if (err instanceof SliderError) {
			console.log(err.message)
		} else {
			throw err
		}
	}
};

function SliderError(message) {
  Error.call(this, message) ;
  this.message = message;
}

SliderError.prototype = Object.create(Error.prototype);


//Add time-animation via js