
const Rect = function (x, y, w, h) {

    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.containsPoint = function (point) {
        return this.x <= point.x && point.x <= this.x + this.width &&
            this.y <= point.y && point.y <= this.y + this.height;
    }

    this.intersects = function (rectangle) {

        /**
         * if (this.Left < rectangle.Right && this.Right > rectangle.Left &&
         this.Top > rectangle.Bottom && this.Bottom < rectangle.Top )
         */
        return this.x < (rectangle.x + rectangle.width) && (this.x + this.width) > rectangle.x &&
            (this.y - this.height) > rectangle.y && this.y < (rectangle.y - rectangle.height);
    }
};
export default Rect;