
export const Rect = function (x, y, w, h) {

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
            (this.y + this.height) > rectangle.y && this.y < (rectangle.y + rectangle.height);
    }
    this.intersectsBounds = function(bounds) {

        const rect = {
            x: bounds.min.x,
            y: bounds.min.y,
            width: bounds.max.x - bounds.min.x,
            height: bounds.max.y - bounds.min.y,
        };

        return this.intersects(rect);
    }
};
export const random = (min, max) => {
    return Math.floor(Math.random() * (max-min)) + min;

}