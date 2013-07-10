/**
 * Add all your dependencies here.
 *
 * @require widgets/Viewer.js
 * @require plugins/LayerTree.js
 * @require plugins/OLSource.js
 * @require plugins/OSMSource.js
 * @require plugins/WMSCSource.js
 * @require plugins/ZoomToExtent.js
 * @require plugins/NavigationHistory.js
 * @require plugins/Zoom.js
 * @require plugins/AddLayers.js
 * @require plugins/RemoveLayer.js
 * @require RowExpander.js
 * @require plugins/ZoomToLayerExtent.js
 * @require plugins/WMSGetFeatureInfo.js
 * @require plugins/Legend.js
 * @require plugins/GoogleGeocoder.js
 * @require widgets/ScaleOverlay.js
 * @require plugins/FeatureManager.js
 * @require plugins/QueryForm.js
 * @require plugins/FeatureGrid.js
 */

var app = new gxp.Viewer({
    portalConfig: {
        layout: "border",
        region: "center",
        
        // by configuring items here, we don't need to configure portalItems
        // and save a wrapping container
        items: [{
            id: "centerpanel",
            xtype: "panel",
            layout: "fit",
            region: "center",
            border: false,
            items: ["mymap"]
        }, {
            id: "westpanel",
            xtype: "panel",
            layout: "border",	//changed from 'fit' to add legend and have flexible borders
            region: "west",
			split: true,	//allows to resize width
			collapsible: true,	//adds posibility of collapsing west panel
			collapseMode: "mini",	//makes collapsed view thinner
			hideCollapseTool: true,	//hides default collapser, but with split:true resize tool works
            width: 200,
			defaults: {	//from here down added to add legend
				width: "100%",
				layout: "fit"
			},
			items: [{
				title: "Layers",
				id: "layerpanel",
				region: "center",	//center region is required for border layout
				border: false,
				flex: 1
			}, {
				id: "legendpanel",
				region: "south",
				split: true,	//allows to resize height
				collapsible: true,	//adds posibility of collapsing west panel
				collapseMode: "mini",	//makes collapsed view thinner
				hideCollapseTool: true,	//hides default collapser, but with split:true resize tool works
				height: 250
			}]
        }, {
            id: "southpanel",
            xtype: "panel",	//"container" cannot be collapsed
            layout: "border",	//to include multiple items
            region: "south",
			split: true,	//allows to resize height
			collapsible: true,	//adds posibility of collapsing south panel
			collapseMode: "mini",	//makes collapsed view thinner
			collapsed: true,	//starts with collapsed mode at load
			hideCollapseTool: true,	//hides default collapser, but with split:true resize tool works
			height: 200,	//default height when expanded
			items:[{
				id: "query",
				region: "west",
				width: 320,
				split: true,
				collapsible: !0,
				collapseMode: "mini",
				collapsed: !0,
				hideCollapseTool: !0,
				layout: "fit"
			}, {
				id: "table",
				region: "center",	//center region is required for border layout
				layout: "fit",
				height: 200
			}]
        }],
        bbar: {id: "mybbar"}
    },
    
    // configuration of all tool plugins for this application
    tools: [{
        ptype: "gxp_layertree",
        outputConfig: {
            id: "tree",
            border: true,
            tbar: [] // we will add buttons to "tree.bbar" later
        },
        outputTarget: "layerpanel"
    }, {
        ptype: "gxp_addlayers",
        actionTarget: "tree.tbar"
    }, {
        ptype: "gxp_removelayer",
        actionTarget: ["tree.tbar", "tree.contextMenu"]
    }, {
        ptype: "gxp_zoomtoextent",
        actionTarget: "map.tbar"
    }, {
        ptype: "gxp_zoom",
        actionTarget: "map.tbar"
    }, {
        ptype: "gxp_navigationhistory",
        actionTarget: "map.tbar"
    }, {
		ptype: "gxp_zoomtolayerextent",	//Anna: added 2 lines by following sdk documentation by OpenGeo
		actionTarget: ["tree.tbar", "tree.contextMenu"]
	}, {
		ptype: "gxp_wmsgetfeatureinfo",	//Anna: added by following sdk documentation by OpenGeo
		format:"grid",	//Anna: added to change pop-up format
		//actionTarget: "map.tbar"	//Anna: for some reason not necessary in this case
		outputConfig:{
			width:400}
	}, {
		ptype: "gxp_legend",	//Anna: added 2 lines by following sdk documentation by OpenGeo
		outputTarget: "legendpanel"
	}, {
		ptype: "gxp_featuremanager",
		id: "ftr_manager",
		paging: false,
		autoSetLayer: true,
		autoLoadFeatures: true	//fills featuregrid with selected layer's records by defaul
	}, {
        ptype: "gxp_queryform",
		featureManager: "ftr_manager",
        actionTarget: ["tree.tbar", "tree.contextMenu"], //button is on map toolbar, GUI goes to new window
		autoExpand: "query",	//expands query when query tool is selected (query needs to be set as collapsible)
		outputTarget: "query"	//where to place query controls
    }, {
		ptype: "gxp_featuregrid",
		featureManager: "ftr_manager",
		//showTotalResults: !0,	//not sure what it does
		//autoLoadFeature: true,	//not sure what it does
		//alwaysDisplayOnMap: !0,	//defaults to displaying query results on map
		controlOptions: {	//allows selecting more than one record from results
			multiple: !0
		},
		//displayMode: "selected",	//displays only selected out of query results, not all query results
		//autoExpand: true,	//expands southpanel when query results are requested, given the conditions
		outputTarget: "table",	//where to show output
		outputConfig: {
			id: "featuregrid",
			//columnsSortable: !1	//false forbids from sorting and selecting output columns
		}
	}, {
		ptype: "gxp_googlegeocoder",//Anna: added 4 lines by following sdk documentation by OpenGeo
		outputTarget: "map.tbar",
		outputConfig: {
			emptyText: "Search for a location ..."	//Anna: how do I find such property in documentation???
		}
	}],
    
    // layer sources
    sources: {
        local: {
            ptype: "gxp_wmscsource",
            url: "/geoserver/wms",
            version: "1.1.1"
        },
		osm: {
			ptype: "gxp_osmsource"
		},
		ol: {
			ptype: "gxp_olsource"
		}
    },
    
    // map and layers
    map: {
        id: "mymap", // id needed to reference map in portalConfig above
        //title: "Map",
        projection: "EPSG:900913",
        center: [-10764594.758211, 4523072.3184791],
        zoom: 4,
        layers: [{
            source: "osm",
            name: "mapnik",
            group: "background"
        }, {
			source: "ol",
			group: "background",
			fixed: true,
			type: "OpenLayers.Layer.Vector",
			args: [
				"None", /*{visibility: false}*/
			]
        }, {
            source: "local",
            name: "usa:US County Boundaries",
            visibility:false
        }, {
            source: "local",
            name: "usa:US State Boundaries",
            selected: false
        }, {
            source: "local",
            name: "usa:StatePlaneNAD83",
            selected: true
        }, {
            source: "local",
            name: "world:UTMZones",
            selected: true
        }],
        items: [ {
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }, {
			xtype: "gxp_scaleoverlay"	//Anna: added scale bar
		}]
    }

});