import Snake from "../entities/Snake.js"
import LightSource from "../utils/LightSource.js"

export default class CanvasRenderer {
    constructor (w, h) {
        const canvas = document.createElement("canvas");

        this.w = canvas.width = w;
        this.h = canvas.height = h;

        this.view = canvas;

        this.ctx = canvas.getContext("2d");
        this.ctx.textBaseline = "top";
    }

    render(container) {
        const { ctx } = this;

        const renderRec = (ctx, container) => {
            container.children.forEach((child) => {
                // Choose to render or not the leaf node
                if (child.visible == false) return;
    
                // Save the context to restore later
                ctx.save();
    
                // Setting where to draw the leaf node
                if (child.position) ctx.translate(Math.round(child.position.x), Math.round(child.position.y));
                
                // Rendering the leaf node
                this.renderLeaf(child, ctx);
    
                // Handle the child nodes
                if (child.children) this.renderRec(ctx, child);
    
                ctx.restore();
            });
        }

        ctx.clearRect(0, 0, this.w, this.h);
        
        renderRec(ctx, container);
    }

    renderLeaf(child, ctx) {
        if (child instanceof Snake) this.renderSnake(child, ctx);
        else if (child instanceof LightSource) this.renderLight(child, ctx);
    }

    renderSnake(child, ctx) {
        ctx.fillStyle = "#114411";
        ctx.strokeStyle = "#444444";

        ctx.globalCompositeOperation = 'destination-over';

        // Draw head
        ctx.beginPath();
        ctx.arc(child.head.x, child.head.y, 10, 0, 2 * Math.PI);
        ctx.fill();

        let tailRatio = 10;
        let tailSegments = Math.round(child.body.length * (9/10));

        let phase = 1;

        // Draw body
        child.body.forEach((segment, index) => {
            ctx.beginPath();
            
            if (index >= child.body.length - tailSegments) {
                ctx.arc(segment.x, segment.y, tailRatio * phase, 0, 2 * Math.PI);
                phase -= (1/tailSegments);
            } else {
                ctx.arc(segment.x, segment.y, 10, 0, 2 * Math.PI);
            }
            ctx.stroke();
            ctx.fill();
        });
    }

    renderLight(child, ctx) {
        this.ligthenGradient(ctx, child.position.x, child.position.y, 800);
    }

    ligthenGradient(ctx, x, y, radius) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        var rnd = Math.abs(0.02 * Math.sin(Date.now() / 1000));

        var radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        radialGradient.addColorStop(0, 'transparent');
        radialGradient.addColorStop(0.02, `rgba(255, 183, 0, 0.1)`);
        radialGradient.addColorStop(0.1 + rnd, `rgba(40, 40, 40, 0.7)`);
        radialGradient.addColorStop(0.2 + rnd, `rgba(40, 40, 40, 1)`);
        radialGradient.addColorStop(1, `rgba(40, 40, 40, 1)`);

        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    renderText(child, ctx) {
        const { font, fill, align } = child.style;
        if (font) ctx.font = font;
        if (fill) ctx.fillStyle = fill;
        if (align) ctx.textAlign = align;
        ctx.fillText(child.text, 0, 0);
    }

    renderTexture(child, ctx) {
        ctx.drawImage(child.texture.img, child.position.x, child.position.y);
    }
}