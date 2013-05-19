/**
 * Touch screen swipe library (modified for callback binding and interval callbacks on move)
 * @link http://padilicious.com/code/touchevents/swipesensejs.html
 * @type {*}
 */
var Swipe = Class.extend({
    // TOUCH-EVENTS SINGLE-FINGER SWIPE-SENSING JAVASCRIPT
    // Courtesy of PADILICIOUS.COM and MACOSXAUTOMATION.COM

    init: function () {
        this.fingerCount = 0;
        this.startX = 0;
        this.startY = 0;
        this.curX = 0;
        this.curY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.horzDiff = 0;
        this.vertDiff = 0;
        this.minLength = 72; // the shortest distance the user may swipe
        this.swipeLength = 0;
        this.swipeAngle = null;
        this.swipeDirection = null;
        this.triggerXCallback = 50;
        this.callbacks = {
            left: [],
            right: [],
            up: [],
            down: [],
            tap: [],
        }
    },

    // The 4 Touch Event Handlers
    bindTouchToElement: function (elementID) {
        var element = document.getElementById(elementID);
        element.addEventListener('touchstart', this.touchStart.bind(this), false);
        element.addEventListener("touchend", this.touchEnd.bind(this), false);
        element.addEventListener("touchmove", this.touchMove.bind(this), false);
        element.addEventListener("touchcancel", this.touchCancel.bind(this), false);
    },

    bindCallback: function (direction, callback) {
        this.callbacks[direction].push(callback);
    },

    touchStart: function (event) {
        // disable the standard ability to select the touched object
        event.preventDefault();
        // get the total number of fingers touching the screen
        this.fingerCount = event.touches.length;
        // since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
        // check that only one finger was used
        if (this.fingerCount == 1) {
            // get the coordinates of the touch
            this.startX = event.touches[0].pageX;
            this.startY = event.touches[0].pageY;
        } else {
            // more than one finger touched so cancel
            this.touchCancel(event);
        }
    },

    touchMove: function (event) {
        event.preventDefault();
        if (event.touches.length == 1) {
            this.curX = event.touches[0].pageX;
            this.curY = event.touches[0].pageY;
            this.deltaX = this.startX - this.curX;
            //If horizontal swipe meets threshold, do left or right callback and start a new swipe
            if (Math.abs(this.deltaX) > this.triggerXCallback) {
                this.swipeDirection = this.deltaX > 0 ? 'left' : 'right';
                this.processingRoutine();
                this.touchCancel();
                this.touchStart(event);
            }
        } else {
            this.touchCancel(event);
        }
    },

    touchEnd: function (event) {
        event.preventDefault();
        // check to see if more than one finger was used and that there is an ending coordinate
        if (this.fingerCount == 1 && this.curX != 0) {
            // use the Distance Formula to determine the length of the swipe
            this.swipeLength = Math.round(Math.sqrt(Math.pow(this.curX - this.startX, 2) + Math.pow(this.curY - this.startY, 2)));
            // if the user swiped more than the minimum length, perform the appropriate action
            if (this.swipeLength >= this.minLength) {
                this.caluculateAngle();
                this.determineSwipeDirection();
                this.processingRoutine();
                this.touchCancel(event); // reset the variables
            } else {
                this.touchCancel(event);
            }
        } else {
            this.swipeDirection = 'tap';
            this.processingRoutine();
            this.touchCancel(event);
        }
    },

    touchCancel: function (event) {
        // reset the variables back to default values
        this.fingerCount = 0;
        this.startX = 0;
        this.startY = 0;
        this.curX = 0;
        this.curY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.horzDiff = 0;
        this.vertDiff = 0;
        this.swipeLength = 0;
        this.swipeAngle = null;
        this.swipeDirection = null;
    },

    caluculateAngle: function () {
        var X = this.startX - this.curX;
        var Y = this.curY - this.startY;
        var Z = Math.round(Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2))); //the distance - rounded - in pixels
        var r = Math.atan2(Y, X); //angle in radians (Cartesian system)
        this.swipeAngle = Math.round(r * 180 / Math.PI); //angle in degrees
        if (this.swipeAngle < 0) {
            this.swipeAngle = 360 - Math.abs(this.swipeAngle);
        }
    },

    determineSwipeDirection: function () {
        if ((this.swipeAngle <= 45) && (this.swipeAngle >= 0)) {
            this.swipeDirection = 'left';
        } else if ((this.swipeAngle <= 360) && (this.swipeAngle >= 315)) {
            this.swipeDirection = 'left';
        } else if ((this.swipeAngle >= 135) && (this.swipeAngle <= 225)) {
            this.swipeDirection = 'right';
        } else if ((this.swipeAngle > 45) && (this.swipeAngle < 135)) {
            this.swipeDirection = 'down';
        } else {
            this.swipeDirection = 'up';
        }
    },

    processingRoutine: function () {
        for (var i = 0; i < this.callbacks[this.swipeDirection].length; i++) {
            this.callbacks[this.swipeDirection][i]();
        }
    }

});