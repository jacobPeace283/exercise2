/* classes */ 

// Color constructor
class Color {

        // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try

        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
                return(this);
            }
        } // end throw

        catch (e) {
            console.log(e);
        }
    } // end Color change method

        // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; this.g += c.g; this.b += c.b; this.a += c.a;
                return(this);
            }
        } // end try

        catch(e) {
            console.log(e);
        }
    } // end color add

        // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; this.g -= c.g; this.b -= c.b; this.a -= c.a;
                return(this);
            }
        } // end try

        catch(e) {
            console.log(e);
        }
    } // end color subgtract

        // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; this.g *= s; this.b *= s; this.a *= s; 
                return(this);
            }
        } // end throw

        catch (e) {
            console.log(e);
        }
    } // end Color scale method

        // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; this.g = c.g; this.b = c.b; this.a = c.a;
                return(this);
            }
        } // end try

        catch(e) {
            console.log(e);
        }
    } // end Color copy method

        // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    } // end Color clone method

        // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }  // end Color toConsole

} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try

    catch(e) {
        console.log(e);
    }
} // end drawPixel


/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html
    var imagedata = context.createImageData(w,h);

    // Define a rectangle in 2D with colors and coords at corners
    var lbc = new Color(255,255,0,255); // left bottom color: yellow
    var rbc = new Color(255,0,125,255); // right bottom corner color: pink
    var mbc = new Color(0,255,255,255); // middle bottom corner color: cyan
    var tc = new Color(255,0,255,255); // top color: magenta
    var lbx = 50, lby = 150; // left bottom position
    var rbx = 200, rby = 150; // right bottom position
    var mbx = 125, mby = 150; // middle bottom position
    var tx = 125, ty = 250; // top position

    // set up the vertical interpolation
    var lc = lbc.clone();  // left color
    var rc = rbc.clone();  // right color
    var vDelta = 1 / (lby-rby); // norm'd vertical delta
    var lcDelta = lbc.clone().subtract(mbc).scale(vDelta); // left vert color delta
    var rcDelta = rbc.clone().subtract(mbc).scale(vDelta); // right vert color delta
    
    // set up the horizontal interpolation
    var hc = new Color(); // horizontal color
    var hDelta = 1 / (rbx-lbx); // norm'd horizontal delta
    var hcDelta = new Color(); // horizontal color delta
    
    // do the interpolation
    for (var y=lby; y<=ty; y++) {
        hc.copy(lc); // begin with the left color
        hcDelta.copy(rc).subtract(lc).scale(hDelta); // reset horiz color delta
        for (var x=tx; x<=lbx; x++) {
            drawPixel(imagedata,x,y,hc);
            hc.add(hcDelta);
        } // end horizontal
        lc.add(lcDelta);
        rc.add(rcDelta);
    } // end vertical
    
    context.putImageData(imagedata, 0, 0); // display the image in the context
}
