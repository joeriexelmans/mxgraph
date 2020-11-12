function bb_standalone(container)
{
    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported())
    {
        // Displays an error message if the browser is not supported.
        mxUtils.error('Browser is not supported!', 200, false);
    }
    else
    {
        // Disables the browser's context menu
        mxEvent.disableContextMenu(container);
        
        // Creates the graph inside the given container
        const graph = new mxGraph(container);

        // Enables rubberband selection
        new mxRubberband(graph);
        
        bb_main(graph);
    }
};
