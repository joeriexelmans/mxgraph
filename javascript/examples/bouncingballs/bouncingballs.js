// Extend Array prototype with efficient filter operation
Array.prototype.filterInPlace = function(cond) {
    let removed = 0;
    for (let i=0; i<this.length; i++) {
        if (!cond(this[i])) {
            removed++;
            continue;
        }
        if (removed > 0) {
            this[i-removed] = this[i];
        }
    }
    this.length -= removed;
}

function bb_main(graph)
{
    const radius = 20;
    const canvas_size = {w: 640, h: 480};

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    const parent = graph.getDefaultParent();

    // Create ball on click
    graph.addListener(mxEvent.CLICK, (sender, evt) => {
        console.log(evt);
        // Ignore consumed events, and only respond to left mouse button:
        if (!evt.isConsumed() && evt.properties.event.button === 0) {
            evt.consume();

            // Create 'ball' at position of click
            const {offsetX, offsetY} = evt.properties.event
            graph.insertVertex(parent, null, '', offsetX-radius, offsetY-radius, radius*2, radius*2, "shape=ellipse;");
        }
    })

    // Invariant: All non-selected balls should be moving.
    const movingBalls = [];

    // Newly created balls are added to movingBalls and are given initial velocity
    graph.addListener(mxEvent.CELLS_ADDED, (sender, evt) => {
        movingBalls.push(...evt.properties.cells);

        evt.properties.cells.forEach(c => {
            c.vx = 1;
            c.vy = 1;
        });
    });

    // Whenever selection changes, update movingBalls
    const selectionModel = graph.getSelectionModel()
    selectionModel.addListener(mxEvent.CHANGE, (sender, evt) => {
        if (evt.properties.removed) {
            movingBalls.filterInPlace(c => !evt.properties.removed.includes(c));
        }
        if (evt.properties.added) {
            movingBalls.push(...evt.properties.added);
        }
    });

    // Animate balls
    window.setInterval(() => {
        movingBalls.forEach(c => {
            // Bounce off walls
            const geom = c.geometry;
            if (geom.x + geom.width >= canvas_size.w) {
                c.vx = -Math.abs(c.vx);
            }
            if (geom.x <= 0) {
                c.vx = Math.abs(c.vx);
            }

            if (geom.y + geom.height >= canvas_size.h) {
                c.vy = -Math.abs(c.vy);
            }
            if (geom.y <= 0) {
                c.vy = Math.abs(c.vy);
            }

            // Step animation
            geom.x += c.vx;
            geom.y += c.vy;
        });

        // Update view - without this call, there is no visible change.
        graph.view.refresh();
    }, 30); // milliseconds
};
