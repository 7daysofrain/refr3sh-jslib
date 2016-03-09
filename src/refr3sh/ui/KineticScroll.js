/**
 * Created by 7daysofrain on 8/3/16.
 */
define([], function()
{

    // Based on code http://ariya.ofilabs.com/2013/08/javascript-kinetic-scrolling-part-1.html

    'use strict';

    var view,
        min, max, offset, reference, pressed, xform,
        velocity, frame, timestamp, ticker,
        amplitude, target, timeConstant,
        snap, mode, current = 0;

    function pos(e) {
        // touch event
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            return mode == KineticScroll.SCROLL_MODE_VERTICAL ? e.targetTouches[0].clientY : e.targetTouches[0].clientX;
        }

        // mouse event
        return mode == KineticScroll.SCROLL_MODE_VERTICAL ? e.clientY : e.clientX;
    }

    function scroll(p) {
        offset = (p > max) ? max : (p < min) ? min : p;
        current = offset;
        if(mode == KineticScroll.SCROLL_MODE_VERTICAL){
            view.style[xform] = 'translateY(' + (-offset) + 'px)';
        }
        else{
            view.style[xform] = 'translateX(' + (-offset) + 'px)'; 
        }
    }

    function track() {
        var now, elapsed, delta, v;

        now = Date.now();
        elapsed = now - timestamp;
        timestamp = now;
        delta = offset - frame;
        frame = offset;

        v = 1000 * delta / (1 + elapsed);
        velocity = 0.8 * v + 0.2 * velocity;
    }

    function autoScroll() {
        var elapsed, delta;

        if (amplitude) {
            elapsed = Date.now() - timestamp;
            delta = -amplitude * Math.exp(-elapsed / timeConstant);
            if (delta > 5 || delta < -5) {
                scroll(target + delta);
                requestAnimationFrame(autoScroll);
            } else {
                scroll(target);
            }
        }
    }

    function tap(e) {
        pressed = true;
        reference = pos(e);

        velocity = amplitude = 0;
        frame = offset;
        timestamp = Date.now();
        clearInterval(ticker);
        ticker = setInterval(track, 100);

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function drag(e) {
        var p, delta;
        if (pressed) {
            p = pos(e);
            delta = reference - p;
            if (delta > 2 || delta < -2) {
                reference = p;
                scroll(offset + delta);
            }
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function release(e) {
        pressed = false;

        clearInterval(ticker);
        target = offset;
        if (velocity > 10 || velocity < -10) {
            amplitude = 0.8 * velocity;
            target = offset + amplitude;
        }
        target = Math.round(target / snap) * snap;
        amplitude = target - offset;
        timestamp = Date.now();
        requestAnimationFrame(autoScroll);

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

	var KineticScroll = function(tview,tmode,tsnap){

        view = tview;
        mode = tmode || KineticScroll.SCROLL_MODE_VERTICAL;
        //view = document.getElementById('view');
        if (typeof window.ontouchstart !== 'undefined') {
            view.addEventListener('touchstart', tap);
            view.addEventListener('touchmove', drag);
            view.addEventListener('touchend', release);
        }
        view.addEventListener('mousedown', tap);
        view.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', release);

        offset = min = 0;
        pressed = false;
        timeConstant = 325; // ms

        //overlay = document.getElementById('overlay');
        snap = tsnap || 1;
        if(mode == KineticScroll.SCROLL_MODE_VERTICAL){
            max = parseInt(getComputedStyle(view).height, 10) - innerHeight;
        }
        else{
            max = parseInt(getComputedStyle(view).width, 10) - innerWidth;
        }
        //overlay.style.top = (4 * snap) + 'px';

        //count = 143;
        //max = (count - 5) * snap;

        xform = 'transform';
        ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
            var e = prefix + 'Transform';
            if (typeof view.style[e] !== 'undefined') {
                xform = e;
                return false;
            }
            return true;
        });
	};
	KineticScroll.prototype.getPos = function(){
		return current;
	}
    KineticScroll.SCROLL_MODE_VERTICAL = "SCROLL_MODE_VERTICAL";
    KineticScroll.SCROLL_MODE_HORIZONTAL = "SCROLL_MODE_HORIZONTAL";
	return KineticScroll;
});